import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

function stripAccents(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function expandQueryForRAG(query: string): string {
  const raw = (query || "").trim();
  if (!raw) return "";
  const qLower = raw.toLowerCase();
  const qAscii = stripAccents(qLower);

  const mapping: Record<string, string[]> = {
    "dich vu": ["services", "service"],
    "dich vu gi": ["services"],
    "lien he": ["contact", "email", "phone", "address"],
    "du an": ["projects", "project"],
    "gioi thieu": ["about"],
    "kien truc": ["architectural", "architecture"],
    "noi that": ["interior"],
    "quy hoach": ["urbanism", "planning"],
    "gia": ["price", "cost", "budget"],
    "bao gia": ["quotation", "quote", "estimate"],
  };

  const extra: string[] = [];
  for (const [k, vals] of Object.entries(mapping)) {
    if (qAscii.includes(k)) extra.push(...vals);
  }

  const parts = [raw];
  if (qAscii !== qLower) parts.push(qAscii);
  if (extra.length > 0) parts.push([...new Set(extra)].sort().join(" "));
  return parts.join(" ");
}

async function retrieveRAGContext(query: string, k = 6): Promise<{ chunks: any[]; context: string }> {
  try {
    const expandedQuery = expandQueryForRAG(query);
    const tsQuery = expandedQuery.split(/\s+/).filter(Boolean).join(" | ");

    const { data, error } = await supabase.rpc("search_kb_chunks", {
      search_query: tsQuery,
      match_count: k,
    });

    if (error || !data?.length) {
      const { data: fallbackData } = await supabase
        .from("kb_chunks")
        .select("id, doc_id, title, source, content")
        .ilike("content", `%${query}%`)
        .limit(k);
      
      if (fallbackData?.length) {
        const context = fallbackData
          .map((c: any) => `[Source: ${c.title || "Untitled"}${c.source ? " | " + c.source : ""}]\n${c.content}`)
          .join("\n\n")
          .slice(0, 2500);
        return { chunks: fallbackData, context };
      }
      return { chunks: [], context: "" };
    }

    const context = data
      .map((c: any) => `[Source: ${c.title || "Untitled"}${c.source ? " | " + c.source : ""}]\n${c.content}`)
      .join("\n\n")
      .slice(0, 2500);
    return { chunks: data, context };
  } catch (err) {
    console.error("RAG retrieval error:", err);
    return { chunks: [], context: "" };
  }
}

export async function processChatMessage({
  messages,
  language = 'vi',
  deviceId = 'unknown',
  sessionId = 'default',
  ipAddress = 'unknown'
}: {
  messages: any[],
  language?: string,
  deviceId?: string,
  sessionId?: string,
  ipAddress?: string
}) {
  const knowledgeBase = await getKnowledgeBase(language);
  
  let historicalMessages: any[] = [];
  try {
    const { data } = await supabase
      .from('chat_history')
      .select('role, content')
      .or(`device_id.eq.${deviceId},ip_address.eq.${ipAddress}`)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (data) {
      historicalMessages = data.reverse().map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
    }
  } catch (err) {
    console.error("Failed to fetch history:", err);
  }

  const currentProcessed = messages
    .filter((msg: any) => msg.content && msg.content.trim() !== '')
    .map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

  let finalMessages: any[] = [];
  if (currentProcessed.length <= 1 && historicalMessages.length > 0) {
    const lastHistoryMsg = historicalMessages[historicalMessages.length - 1].content;
    const firstCurrentMsg = currentProcessed[0]?.content;
    
    if (lastHistoryMsg === firstCurrentMsg) {
      finalMessages = historicalMessages;
    } else {
      finalMessages = [...historicalMessages, ...currentProcessed];
    }
  } else {
    finalMessages = currentProcessed;
  }

  if (finalMessages.length === 0) {
    return { content: language === 'en' ? "How can I help you today?" : "Tôi có thể giúp gì cho bạn?", sources: [] };
  }

  const lastUserMessage = finalMessages[finalMessages.length - 1].content;
  const { chunks: ragChunks, context: ragContext } = await retrieveRAGContext(lastUserMessage);

  let combinedKnowledge = knowledgeBase;
  if (ragContext) {
    combinedKnowledge = `${knowledgeBase}\n\n--- RAG CONTEXT (from knowledge base documents) ---\n${ragContext}`;
  }

  const systemInstruction = `ROLE: You are the AI Architect for Five Plus One (Kosuke Osawa).
KNOWLEDGE BASE:
${combinedKnowledge}

STRICT PROTOCOL FOR LEADS:
1. If a user asks to book, design, or work together, you MUST collect: Name, Email, Phone, Project scope.
2. DO NOT call 'create_order' until you have ALL FOUR.
3. Language: ${language === 'vi' ? 'Vietnamese' : 'English'}
4. When answering questions about FIVE+ONE, prioritize information from the RAG CONTEXT section if available.`;

  const tools: any[] = [{
    type: "function",
    function: {
      name: "create_order",
      description: "Sends customer lead information to the CRM system.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string" },
          phone: { type: "string" },
          message: { type: "string" },
        },
        required: ["name", "email", "phone", "message"],
      },
    },
  }];

  const sources = ragChunks.slice(0, 4).map((c: any) => ({
    doc_id: c.doc_id,
    title: c.title,
    source: c.source,
    score: c.rank || 0,
  }));

  try {
    const response = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemInstruction },
        ...finalMessages
      ],
      tools,
      tool_choice: "auto",
      temperature: 0.2,
      max_tokens: 1024,
    });

    const message = response.choices[0].message;

    if (message.tool_calls && message.tool_calls.length > 0) {
      const toolCall = message.tool_calls[0];
      if (toolCall.function.name === "create_order") {
        const { name, email, phone, message: orderMsg } = JSON.parse(toolCall.function.arguments);
        
        await supabase.from('contact_messages').insert([{ name, email, phone, message: orderMsg }]);
        
        const webhookUrl = process.env.CRM_WEBHOOK_URL;
        if (webhookUrl) {
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, message: orderMsg, source: 'Chatbot AI (Groq)' }),
          }).catch(() => {});
        }

        return {
          content: language === 'en' 
            ? `Excellent. I've recorded your details, ${name}. Our studio will contact you soon.` 
            : `Tuyệt vời. Tôi đã ghi lại thông tin của bạn, ${name}. Studio của chúng tôi sẽ liên hệ với bạn sớm nhất.`,
          sources: []
        };
      }
    }

    const content = message.content || "";
    await supabase.from('chat_history').insert([
      { session_id: sessionId, device_id: deviceId, ip_address: ipAddress, role: 'user', content: lastUserMessage },
      { session_id: sessionId, device_id: deviceId, ip_address: ipAddress, role: 'assistant', content: content }
    ]);

    return { content, sources };
  } catch (error: any) {
    console.error("Groq Error:", error);
    
    return { 
      content: language === 'en' 
        ? "I'm having trouble connecting right now. Let's talk again soon." 
        : "Tôi đang gặp khó khăn khi kết nối. Hãy trò chuyện lại sau nhé.",
      sources: []
    };
  }
}

async function getKnowledgeBase(language: string) {
  try {
    const { data } = await supabase.from('chatbot_settings').select('value').eq('key', `knowledge_base_${language}`).single();
    if (data?.value) return data.value;
  } catch {}
  return language === 'en' ? "Architecture studio philosophy..." : "Triết lý studio kiến trúc...";
}
