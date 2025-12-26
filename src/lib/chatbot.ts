import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

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
  
  const processedMessages = messages
    .filter((msg: any) => msg.content && msg.content.trim() !== '')
    .map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

  const coalescedMessages: any[] = [];
  for (const msg of processedMessages) {
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
    model: "gemini-2.0-flash-lite",
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
    // Fallback logic...
    const fallbackResult = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: finalLastUserMessage }] }]
    });
    return { content: fallbackResult.response.text() };
  }
}

async function getKnowledgeBase(language: string) {
  try {
    const { data } = await supabase.from('chatbot_settings').select('value').eq('key', `knowledge_base_${language}`).single();
    if (data?.value) return data.value;
  } catch {}
  return language === 'en' ? "Architecture studio philosophy..." : "Triết lý studio kiến trúc...";
}
