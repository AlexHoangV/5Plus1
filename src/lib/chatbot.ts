import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
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

async function callGroqFallback(messages: { role: string; content: string }[], language: string, ragContext?: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return "";
  
  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  
  let systemContent = `You are an AI assistant for Five Plus One architecture studio. Respond in ${language === 'vi' ? 'Vietnamese' : 'English'}. Be helpful and concise.`;
  if (ragContext) {
    systemContent += `\n\nCONTEXT (from knowledge base):\n${ragContext}`;
  }
  
  try {
    const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemContent },
          ...messages
        ],
        temperature: 0.2,
        max_tokens: 512,
      }),
    });
    
    if (!resp.ok) return "";
    const data = await resp.json();
    return data.choices?.[0]?.message?.content || "";
  } catch {
    return "";
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
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
    }
  } catch (err) {
    console.error("Failed to fetch history:", err);
  }

  const currentProcessed = messages
    .filter((msg: any) => msg.content && msg.content.trim() !== '')
    .map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

  let finalMessages: any[] = [];
  if (currentProcessed.length <= 1 && historicalMessages.length > 0) {
    const lastHistoryMsg = historicalMessages[historicalMessages.length - 1].parts[0].text;
    const firstCurrentMsg = currentProcessed[0]?.parts[0].text;
    
    if (lastHistoryMsg === firstCurrentMsg) {
      finalMessages = historicalMessages;
    } else {
      finalMessages = [...historicalMessages, ...currentProcessed];
    }
  } else {
    finalMessages = currentProcessed;
  }

  const coalescedMessages: any[] = [];
  for (const msg of finalMessages) {
    if (coalescedMessages.length > 0 && coalescedMessages[coalescedMessages.length - 1].role === msg.role) {
      coalescedMessages[coalescedMessages.length - 1].parts[0].text += "\n\n" + msg.parts[0].text;
    } else {
      coalescedMessages.push(msg);
    }
  }

  while (coalescedMessages.length > 0 && coalescedMessages[0].role !== 'user') {
    coalescedMessages.shift();
  }

  if (coalescedMessages.length === 0) {
    return { content: language === 'en' ? "How can I help you today?" : "Tôi có thể giúp gì cho bạn?", sources: [] };
  }

  const lastMsg = coalescedMessages.pop();
  const finalLastUserMessage = lastMsg.parts[0].text;
  const finalHistory = coalescedMessages;

  const { chunks: ragChunks, context: ragContext } = await retrieveRAGContext(finalLastUserMessage);

  let combinedKnowledge = knowledgeBase;
  if (ragContext) {
    combinedKnowledge = `${knowledgeBase}\n\n--- RAG CONTEXT (from knowledge base documents) ---\n${ragContext}`;
  }

  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    systemInstruction: {
      parts: [{ text: `ROLE: You are the AI Architect for Five Plus One (Kosuke Osawa).
KNOWLEDGE BASE:
${combinedKnowledge}

STRICT PROTOCOL FOR LEADS:
1. If a user asks to book, design, or work together, you MUST collect: Name, Email, Phone, Project scope.
2. DO NOT call 'create_order' until you have ALL FOUR.
3. Language: ${language === 'vi' ? 'Vietnamese' : 'English'}
4. When answering questions about FIVE+ONE, prioritize information from the RAG CONTEXT section if available.` }],
    },
    tools: [{
      functionDeclarations: [{
        name: "create_order",
        description: "Sends customer lead information to the CRM system.",
        parameters: {
          type: "OBJECT",
          properties: {
            name: { type: "STRING" },
            email: { type: "STRING" },
            phone: { type: "STRING" },
            message: { type: "STRING" },
          },
          required: ["name", "email", "phone", "message"],
        },
      }],
    }],
  });

  const sources = ragChunks.slice(0, 4).map((c: any) => ({
    doc_id: c.doc_id,
    title: c.title,
    source: c.source,
    score: c.rank || 0,
  }));

  try {
    const chat = model.startChat({ history: finalHistory });
    const result = await chat.sendMessage(finalLastUserMessage);
    const response = await result.response;
    
    const call = response.functionCalls()?.[0];
    if (call && call.name === "create_order") {
      const { name, email, phone, message } = call.args as any;
      await supabase.from('contact_messages').insert([{ name, email, phone, message }]);
      
      const webhookUrl = process.env.CRM_WEBHOOK_URL;
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, message, source: 'Chatbot AI' }),
        }).catch(() => {});
      }

      return {
        content: language === 'en' 
          ? `Excellent. I've recorded your details, ${name}. Our studio will contact you soon.` 
          : `Tuyệt vời. Tôi đã ghi lại thông tin của bạn, ${name}. Studio của chúng tôi sẽ liên hệ với bạn sớm nhất.`,
        sources: []
      };
    }

    const content = response.text();
    await supabase.from('chat_history').insert([
      { session_id: sessionId, device_id: deviceId, ip_address: ipAddress, role: 'user', content: finalLastUserMessage },
      { session_id: sessionId, device_id: deviceId, ip_address: ipAddress, role: 'model', content: content }
    ]);

    return { content, sources };
  } catch (error: any) {
    console.error("Gemini Error:", error);
    
    if (error.status === 403 || error.message?.includes('403') || error.message?.includes('API key')) {
      const groqFallbackMsg = await callGroqFallback(
        finalMessages.map(m => ({ role: m.role === 'model' ? 'assistant' : 'user', content: m.parts[0].text })),
        language,
        ragContext
      );
      if (groqFallbackMsg) {
        await supabase.from('chat_history').insert([
          { session_id: sessionId, device_id: deviceId, ip_address: ipAddress, role: 'user', content: finalLastUserMessage },
          { session_id: sessionId, device_id: deviceId, ip_address: ipAddress, role: 'model', content: groqFallbackMsg }
        ]);
        return { content: groqFallbackMsg, sources };
      }
      return { 
        content: language === 'en' 
          ? "Our AI assistant is currently resting to improve its vision. Please contact us directly via email or phone for immediate assistance." 
          : "Trợ lý AI của chúng tôi hiện đang tạm nghỉ để nâng cấp tầm nhìn. Vui lòng liên hệ trực tiếp qua email hoặc số điện thoại để được hỗ trợ ngay lập tức.",
        sources: []
      };
    }

    try {
      const fallbackResult = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: finalLastUserMessage }] }]
      });
      return { content: fallbackResult.response.text(), sources };
    } catch {
      return { 
        content: language === 'en' 
          ? "I'm having trouble connecting right now. Let's talk again soon." 
          : "Tôi đang gặp khó khăn khi kết nối. Hãy trò chuyện lại sau nhé.",
        sources: []
      };
    }
  }
}

async function getKnowledgeBase(language: string) {
  try {
    const { data } = await supabase.from('chatbot_settings').select('value').eq('key', `knowledge_base_${language}`).single();
    if (data?.value) return data.value;
  } catch {}
  return language === 'en' ? "Architecture studio philosophy..." : "Triết lý studio kiến trúc...";
}
