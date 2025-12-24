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
    const lastUserMessage = messages[messages.length - 1].content;

    // 1. Process and Clean History for Gemini
    // - Coalesce consecutive same-role messages
    // - Ensure starts with 'user'
    // - Ensure alternating roles
    // - Ensure ends with 'model' (before sending the current user message)
    
    let processedHistory: any[] = [];
    let lastRole: string | null = null;

    // Skip initial assistant welcome messages to satisfy Gemini's "start with user" rule
    let firstUserFound = false;

    for (let i = 0; i < messages.length - 1; i++) {
      const msg = messages[i];
      const currentRole = msg.role === 'user' ? 'user' : 'model';

      if (!firstUserFound) {
        if (currentRole === 'user') {
          firstUserFound = true;
        } else {
          continue; // Skip until we find the first user message
        }
      }

      if (lastRole === currentRole) {
        // Coalesce
        const lastMsg = processedHistory[processedHistory.length - 1];
        lastMsg.parts[0].text += "\n" + msg.content;
      } else {
        processedHistory.push({
          role: currentRole,
          parts: [{ text: msg.content }]
        });
        lastRole = currentRole;
      }
    }

    // Gemini requires the LAST message in history to be from 'model' 
    // because the next call (sendMessage) will be from 'user'.
    if (processedHistory.length > 0 && processedHistory[processedHistory.length - 1].role === 'user') {
      // If history ends with user, we could either:
      // 1. Remove it and prepend to current message (but it's already in history)
      // 2. Add a dummy model response (bad)
      // 3. Just trim it.
      // Most reliable: if the user just sent a message and we're about to send another,
      // Gemini expects a model response in between. 
      // In our case, the messages array is [A, U, A, U, U_last]. 
      // processedHistory is [U, A, U]. This is bad.
      // Let's ensure alternating and ending with model.
      
      // If history ends with 'user', we drop it from history and append to lastUserMessage
      // This happens if the user sent two messages in a row at the end.
    }

    // Refined History Logic:
    const finalHistory: any[] = [];
    let currentHistoryRole: string = 'user'; // Start expecting user

    for (const h of processedHistory) {
      if (h.role === currentHistoryRole) {
        finalHistory.push(h);
        currentHistoryRole = currentHistoryRole === 'user' ? 'model' : 'user';
      } else {
        // Skip or coalesce if roles don't alternate
        if (finalHistory.length > 0) {
          finalHistory[finalHistory.length - 1].parts[0].text += "\n" + h.parts[0].text;
        }
      }
    }

    // Ensure it ends with 'model' if not empty
    if (finalHistory.length > 0 && finalHistory[finalHistory.length - 1].role === 'user') {
      finalHistory.pop();
    }

    // 2. Initialize Model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest",
      systemInstruction: {
        parts: [{ text: `Role & Knowledge Base:\n${knowledgeBase}\n\nLanguage: ${language}` }],
      }
    });

    // 3. Attempt Chat
    try {
      const chat = model.startChat({
        history: finalHistory,
      });

      const result = await chat.sendMessage(lastUserMessage);
      const response = await result.response;
      return NextResponse.json({ content: response.text() });
    } catch (chatError: any) {
      console.error("Chat Session Error:", chatError);
      // Fallback to simple generateContent if chat session fails
      const prompt = `System: ${knowledgeBase}\n\nUser: ${lastUserMessage}\nAssistant:`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return NextResponse.json({ content: response.text() });
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
