import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

async function callGroqFallback(messages: { role: string; content: string }[], language: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return "";
  
  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  
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
          { role: "system", content: `You are an AI assistant for Five Plus One architecture studio. Respond in ${language === 'vi' ? 'Vietnamese' : 'English'}. Be helpful and concise.` },
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
  
  // 1. Fetch historical messages from Supabase if we don't have enough context
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

  // 2. Process current messages
  const currentProcessed = messages
    .filter((msg: any) => msg.content && msg.content.trim() !== '')
    .map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

  // 3. Merge history with current messages, avoiding duplicates if possible
  // If the last message in history is the same as one of the current messages, we should handle that.
  // For simplicity, if currentProcessed has more than 1 message, we assume it has its own context.
  // If currentProcessed has only 1 message, we prepend the history.
  
  let finalMessages: any[] = [];
  if (currentProcessed.length <= 1 && historicalMessages.length > 0) {
    // Check if the last message in historicalMessages is already in currentProcessed
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
    return { content: language === 'en' ? "How can I help you today?" : "Tôi có thể giúp gì cho bạn?" };
  }

  const lastMsg = coalescedMessages.pop();
  const finalLastUserMessage = lastMsg.parts[0].text;
  const finalHistory = coalescedMessages;

  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    systemInstruction: {
      parts: [{ text: `ROLE: You are the AI Architect for Five Plus One (Kosuke Osawa).
KNOWLEDGE BASE:
${knowledgeBase}

STRICT PROTOCOL FOR LEADS:
1. If a user asks to book, design, or work together, you MUST collect: Name, Email, Phone, Project scope.
2. DO NOT call 'create_order' until you have ALL FOUR.
3. Language: ${language === 'vi' ? 'Vietnamese' : 'English'}` }],
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
          : `Tuyệt vời. Tôi đã ghi lại thông tin của bạn, ${name}. Studio của chúng tôi sẽ liên hệ với bạn sớm nhất.`
      };
    }

    const content = response.text();
    // Store in history
    await supabase.from('chat_history').insert([
      { session_id: sessionId, device_id: deviceId, ip_address: ipAddress, role: 'user', content: finalLastUserMessage },
      { session_id: sessionId, device_id: deviceId, ip_address: ipAddress, role: 'model', content: content }
    ]);

    return { content };
  } catch (error: any) {
    console.error("Gemini Error:", error);
    
    // Handle Leaked Key / Auth Errors gracefully
if (error.status === 403 || error.message?.includes('403') || error.message?.includes('API key')) {
        const groqFallbackMsg = await callGroqFallback(
          finalMessages.map(m => ({ role: m.role === 'model' ? 'assistant' : 'user', content: m.parts[0].text })),
          language
        );
        if (groqFallbackMsg) {
          await supabase.from('chat_history').insert([
            { session_id: sessionId, device_id: deviceId, ip_address: ipAddress, role: 'user', content: finalLastUserMessage },
            { session_id: sessionId, device_id: deviceId, ip_address: ipAddress, role: 'model', content: groqFallbackMsg }
          ]);
          return { content: groqFallbackMsg };
        }
        return { 
          content: language === 'en' 
            ? "Our AI assistant is currently resting to improve its vision. Please contact us directly via email or phone for immediate assistance." 
            : "Trợ lý AI của chúng tôi hiện đang tạm nghỉ để nâng cấp tầm nhìn. Vui lòng liên hệ trực tiếp qua email hoặc số điện thoại để được hỗ trợ ngay lập tức."
        };
      }

    try {
      const fallbackResult = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: finalLastUserMessage }] }]
      });
      return { content: fallbackResult.response.text() };
    } catch (fallbackError) {
      return { 
        content: language === 'en' 
          ? "I'm having trouble connecting right now. Let's talk again soon." 
          : "Tôi đang gặp khó khăn khi kết nối. Hãy trò chuyện lại sau nhé."
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
