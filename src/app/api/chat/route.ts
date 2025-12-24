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
    
    let processedMessages: any[] = [];
    let lastRole: string | null = null;

    // Process all messages including the new one
    for (const msg of messages) {
      const role = msg.role === 'user' ? 'user' : 'model';
      
      if (role === lastRole && processedMessages.length > 0) {
        processedMessages[processedMessages.length - 1].parts[0].text += "\n" + msg.content;
      } else {
        processedMessages.push({
          role: role,
          parts: [{ text: msg.content }]
        });
        lastRole = role;
      }
    }

    // Remove leading 'model' messages
    while (processedMessages.length > 0 && processedMessages[0].role !== 'user') {
      processedMessages.shift();
    }

    if (processedMessages.length === 0) {
      return NextResponse.json({ 
        error: "No valid user message found",
        content: language === 'en' ? "How can I help you today?" : "Tôi có thể giúp gì cho bạn?"
      });
    }

    // Split into history and last user message
    // Gemini startChat history MUST NOT include the message we're about to send
    // And it MUST end with a 'model' message or be empty.
    
    const lastMsg = processedMessages.pop();
    let finalLastUserMessage = lastMsg.parts[0].text;
    
    // If the last message was from 'model', something is wrong (the user just sent a message)
    // But our loop above ensures if the last message in 'messages' was 'user', then lastMsg is 'user'.
    
    const finalHistory = processedMessages;

    // 2. Initialize Model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: {
        parts: [{ text: `Role & Knowledge Base:\n${knowledgeBase}\n\nLanguage: ${language}` }],
      }
    });

    // 3. Attempt Chat
    try {
      console.log("Chat Attempt - Model: gemini-1.5-flash");
      // Validate history alternating
      // If history ends with 'user', we need to append it to the next message
      // because startChat history -> next message must be user.
      let chatHistory = [...finalHistory];
      let messageToSend = finalLastUserMessage;

      if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === 'user') {
        const lastHistoryMsg = chatHistory.pop();
        messageToSend = lastHistoryMsg.parts[0].text + "\n" + messageToSend;
      }

      console.log("History Length:", chatHistory.length);
      console.log("Message to Send:", messageToSend.substring(0, 50) + "...");

      const chat = model.startChat({
        history: chatHistory,
      });

      const result = await chat.sendMessage(messageToSend);
      const response = await result.response;
      return NextResponse.json({ content: response.text() });
    } catch (chatError: any) {
      console.error("Chat Session Error Details:", chatError.message);
      // Fallback to simple generateContent if chat session fails
      const result = await model.generateContent(finalLastUserMessage);
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
