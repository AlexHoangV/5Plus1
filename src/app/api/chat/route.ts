import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Gemini and Supabase
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

// Fallback Knowledge Base (Default)
const DEFAULT_KNOWLEDGE_VI = `
ROLE: Bạn là AI Architect & Brand Manager của Five Plus One (5plus1). Bạn đại diện cho triết lý của KTS Kosuke Osawa. 
Bạn mang phong thái của một Kiến Trúc Sư: Điềm đạm, sâu sắc, tinh tế (Zen), nhưng bên trong vẫn vận hành theo hệ thống "Straight Line" (Đường thẳng) để dẫn khách về đích (Chốt deal).

BRAND PHILOSOPHY:
- Godai (Ngũ Đại): Đất (Chi), Nước (Sui), Lửa (Ka), Gió (Fu), Hư Không (Ku).
- +1 (Human): Con người là yếu tố thứ 6, mang lại sự sống cho không gian.
- Core Values: Persistence (Sự kiên trì), Consistency (Sự nhất quán), Trust (Niềm tin).
- Principal Architect: KTS Kosuke Osawa.

TONE: Sophisticated, Zen, Empathetic but Firm. Hybrid culture (Japan x Vietnam).
`;

const DEFAULT_KNOWLEDGE_EN = `
ROLE: You are the AI Architect & Brand Manager for Five Plus One (5plus1). You represent the philosophy of Architect Kosuke Osawa.
You carry the demeanor of an Architect: Calm, deep, sophisticated (Zen), but internally operating according to the "Straight Line" system to lead the customer to the goal.

BRAND PHILOSOPHY:
- Godai: Earth, Water, Fire, Wind, Void.
- +1 (Human): Humans are the 6th element.
- Core Values: Persistence, Consistency, Trust.
- Principal Architect: Kosuke Osawa.

TONE: Sophisticated, Zen, Empathetic but Firm. Hybrid culture (Japan x Vietnam).
`;

async function getKnowledgeBase(language: string) {
  try {
    const { data, error } = await supabase
      .from('chatbot_settings')
      .select('value')
      .eq('key', `knowledge_base_${language}`)
      .single();

    if (data?.value) return data.value;
    if (error) console.warn("Supabase knowledge fetch error:", error.message);
  } catch (err) {
    console.error("Error fetching knowledge base:", err);
  }
  return language === 'en' ? DEFAULT_KNOWLEDGE_EN : DEFAULT_KNOWLEDGE_VI;
}

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { messages, language = 'vi' } = body;

  try {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const knowledgeBase = await getKnowledgeBase(language);
    
    // 1. Process and Clean History for Gemini
    // Ensure history is alternating user/model and starts with user
    const processedMessages = messages
      .filter((msg: any) => msg.content && msg.content.trim() !== '')
      .map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

    // Coalesce consecutive same-role messages
    const coalescedMessages: any[] = [];
    for (const msg of processedMessages) {
      if (coalescedMessages.length > 0 && coalescedMessages[coalescedMessages.length - 1].role === msg.role) {
        coalescedMessages[coalescedMessages.length - 1].parts[0].text += "\n\n" + msg.parts[0].text;
      } else {
        coalescedMessages.push(msg);
      }
    }

    // Ensure starts with 'user'
    while (coalescedMessages.length > 0 && coalescedMessages[0].role !== 'user') {
      coalescedMessages.shift();
    }

    if (coalescedMessages.length === 0) {
      return NextResponse.json({ 
        content: language === 'en' ? "How can I help you today?" : "Tôi có thể giúp gì cho bạn?"
      });
    }

    // Extract the last message (which must be from 'user')
    const lastMsg = coalescedMessages.pop();
    const finalLastUserMessage = lastMsg.parts[0].text;
    const finalHistory = coalescedMessages;

    // 2. Initialize Model (Gemini 2.5 Flash - Latest Stable for this key)
    const MODEL_NAME = "gemini-2.5-flash"; 
    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
      systemInstruction: {
        parts: [{ text: `ROLE & KNOWLEDGE BASE (STRICT RAG):\n${knowledgeBase}\n\nINSTRUCTIONS:\n1. Use ONLY the provided knowledge base to answer.\n2. If unsure, say you don't know and suggest contact.\n3. Keep the tone Architect-like (Zen, Professional).\n4. Current Language: ${language}` }],
      }
    });

    // 3. Attempt Chat with robust error handling
    try {
      console.log(`Chat Attempt - Model: ${MODEL_NAME}`);
      
      const chat = model.startChat({
        history: finalHistory,
      });

      const result = await chat.sendMessage(finalLastUserMessage);
      const response = await result.response;
      return NextResponse.json({ content: response.text() });
    } catch (chatError: any) {
      console.error("Chat Session Error:", chatError.message);
      
      // Fallback 1: Try gemini-2.5-flash-lite or direct generateContent
      try {
        const result = await model.generateContent({
          contents: [
            { role: 'user', parts: [{ text: `System Info: ${knowledgeBase}\n\nUser Question: ${finalLastUserMessage}` }] }
          ]
        });
        const response = await result.response;
        return NextResponse.json({ content: response.text() });
      } catch (fallbackError: any) {
        console.error("All Model Fallbacks Failed:", fallbackError.message);
        throw fallbackError;
      }
    }

  } catch (error: any) {
    console.error("Critical Gemini API Error:", error);
    
    // Final hard fallback
    return NextResponse.json({ 
      error: "Service temporarily unavailable",
      content: language === 'en' 
        ? "I apologize, I'm experiencing some connectivity issues. Please try again in a moment." 
        : "Thật xin lỗi, tôi đang gặp chút gián đoạn kết nối. Vui lòng thử lại sau giây lát."
    }, { status: 500 });
  }
}
