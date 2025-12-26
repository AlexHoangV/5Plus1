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
    
    // Process and clean history for Gemini
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

    // Extract the last message
    const lastMsg = coalescedMessages.pop();
    const finalLastUserMessage = lastMsg.parts[0].text;
    const finalHistory = coalescedMessages;

    // Use gemini-2.0-flash-lite for better availability if flash 2.0 is at quota
    const MODEL_NAME = "gemini-2.0-flash-lite"; 
    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
      systemInstruction: {
        parts: [{ text: `ROLE: You are the AI Architect for Five Plus One (Kosuke Osawa).
KNOWLEDGE BASE:
${knowledgeBase}

STRICT PROTOCOL FOR LEADS:
1. If a user asks to book, design, or work together, you MUST collect:
   - Full Name
   - Email
   - Phone Number
   - Request Details (Project scope)
2. DO NOT call 'create_order' until you have ALL FOUR pieces of information.
3. After calling the tool, confirm to the user that Kosuke's team will reach out.
4. Language: ${language === 'vi' ? 'Vietnamese' : 'English'}` }],
      },
      tools: [
        {
          functionDeclarations: [
            {
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
            },
          ],
        },
      ],
    });

    try {
      const chat = model.startChat({
        history: finalHistory,
      });

      const result = await chat.sendMessage(finalLastUserMessage);
      const response = await result.response;
      
      const call = response.functionCalls()?.[0];
      if (call && call.name === "create_order") {
        const { name, email, phone, message } = call.args as any;
        
        try {
          await supabase.from('contact_messages').insert([{ name, email, phone, message }]);
        } catch (dbError) {
          console.error("Supabase insert error:", dbError);
        }

        const webhookUrl = process.env.CRM_WEBHOOK_URL;
        if (webhookUrl) {
          try {
            await fetch(webhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, email, phone, message, source: 'Chatbot AI' }),
            });
          } catch (e) {
            console.error("External CRM sync failed:", e);
          }
        }

        return NextResponse.json({ 
          content: language === 'en' 
            ? `Excellent. I've recorded your details, ${name}. Our studio will review your request and contact you at ${email} or ${phone} soon.` 
            : `Tuyệt vời. Tôi đã ghi lại thông tin của bạn, ${name}. Studio của chúng tôi sẽ xem xét yêu cầu và liên hệ với bạn qua ${email} hoặc ${phone} sớm nhất.`
        });
      }

      return NextResponse.json({ content: response.text() });
    } catch (chatError: any) {
      console.warn("Primary model/chat error, trying direct generation fallback:", chatError.message);
      
      // Direct generation fallback without chat history (stateless) if history causes errors
      const fallbackResult = await model.generateContent({
        contents: [
          { 
            role: 'user', 
            parts: [{ text: `System Instruction: You are the AI Architect for Five Plus One.\nUser Message: ${finalLastUserMessage}` }] 
          }
        ]
      });
      const fallbackResponse = await fallbackResult.response;
      return NextResponse.json({ content: fallbackResponse.text() });
    }

  } catch (error: any) {
    console.error("Final Gemini API Route Error:", error);
    
    // Check if it's a quota error
    const isQuotaError = error.message?.includes("429") || error.message?.includes("quota");

    return NextResponse.json({ 
      error: isQuotaError ? "Quota exceeded" : "Service temporarily unavailable",
      content: language === 'en' 
        ? (isQuotaError 
            ? "I'm currently at my message limit. Please try again in a moment or contact us directly via the form below."
            : "I apologize, I'm experiencing some connectivity issues. Please try again in a moment.")
        : (isQuotaError
            ? "Tôi hiện đã đạt giới hạn tin nhắn. Vui lòng thử lại sau giây lát hoặc liên hệ trực tiếp qua biểu mẫu bên dưới."
            : "Thật xin lỗi, tôi đang gặp chút gián đoạn kết nối. Vui lòng thử lại sau giây lát.")
    }, { status: error.status || 500 });
  }
}
