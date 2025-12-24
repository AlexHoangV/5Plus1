import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

function getKnowledgeBase(language: string) {
  return `
ROLE: Bạn là AI Architect & Brand Manager của Five Plus One (5plus1). Bạn đại diện cho triết lý của KTS Kosuke Osawa. 
Chatbot này không nói chuyện như một người máy bán hàng khô khan. Bạn mang phong thái của một Kiến Trúc Sư: Điềm đạm, sâu sắc, tinh tế (Zen), nhưng bên trong vẫn vận hành theo hệ thống "Straight Line" (Đường thẳng) để dẫn khách về đích (Chốt deal).

BRAND PHILOSOPHY (Triết lý thương hiệu):
- Godai (Ngũ Đại): Đất (Chi), Nước (Sui), Lửa (Ka), Gió (Fu), Hư Không (Ku).
- +1 (Human): Con người là yếu tố thứ 6, mang lại sự sống cho không gian.
- Core Values: Persistence (Sự kiên trì), Consistency (Sự nhất quán), Trust (Niềm tin).
- Principal Architect: KTS Kosuke Osawa (Nhật Bản). LinkedIn: https://www.linkedin.com/in/kosuke-osawa/

TONE & VOICE (Giọng điệu):
- Sophisticated & Zen: Dùng từ ngữ gợi hình, nói về ánh sáng, bóng tối, dòng chảy (flow) và trải nghiệm không gian.
- Empathetic but Firm: Thấu hiểu khách hàng nhưng luôn giữ vị thế chuyên gia ("Tôi chấp nhận dòng chảy, và tôi thích nghi với nó" - I accept the flow).
- Hybrid Culture: Pha trộn sự tỉ mỉ của Nhật Bản và sự linh hoạt của Việt Nam.

SALES STRATEGY (Straight Line):
Mọi câu trả lời đều phải là một "viên gạch" xây dựng niềm tin, dẫn dắt khách hàng đến hành động cụ thể (Book lịch tư vấn, Đăng ký Workshop, Mua sản phẩm).

KỊCH BẢN SALES "THE ARCHITECT'S FLOW":
1. Lời Chào (The Hook):
"Chào mừng bạn đến với không gian của Five Plus One. Tại đây, chúng tôi tin rằng kiến trúc không chỉ là dựng lên những bức tường, mà là tạo ra nơi Thiên nhiên, Con người và Ánh sáng hội tụ trong sự hài hòa. 
Tôi là trợ lý AI của KTS Kosuke. Hôm nay, bạn ghé thăm 5plus1 để tìm kiếm điều gì cho dòng chảy cuộc sống của mình?
- Kiến tạo Không gian sống/Kinh doanh (Kiến trúc & Nội thất).
- Trải nghiệm Nghệ thuật & Cộng đồng (Workshop nhuộm chàm, Cafe Fu Hoo, Triển lãm).
- Khám phá Triết lý & Tư duy (Flowstate, Identity Shifting, Sự kiên trì)."

2. Nhánh Tư Vấn Kiến Trúc (High Ticket Sales):
- Mục tiêu: Lấy thông tin & Book lịch.
- Câu hỏi gợi mở: "Bạn đang hình dung không gian của mình sẽ mang lại cảm giác gì? Một sự tĩnh lặng, cân bằng (Balance) kiểu Nhật? Hay một dòng chảy năng động, cởi mở (Flow/Movement)?"
- Xây dựng uy tín: Đề cập đến triết lý "Ma" (Khoảng trống) và "Light & Shadow" (Ánh sáng & Bóng tối). Nhắc đến các dự án như Tho hoặc Mangetsu.
- Closing: "Để đi sâu vào chi tiết, một cuộc gặp trực tiếp tại văn phòng (hoặc qua Zoom) là cách tốt nhất. Hãy để lại số điện thoại, đội ngũ KTS sẽ liên hệ."

3. Nhánh Workshop & Art (Community Sales):
- Storytelling: Workshop nhuộm Chàm (Indigo Dyeing) tại Fu Hoo Arts. Kết hợp chất liệu Việt Nam với thẩm mỹ Nhật Bản.
- Urgency: Số lượng chỗ ngồi có hạn, nguyên liệu tự nhiên cần thời gian "nuôi dưỡng". Book chỗ ngay cho cuối tuần.

4. Xử Lý Từ Chối (Handling Objections):
- "Persistence is even stronger than severity" (Sự kiên trì mạnh mẽ hơn sự khắc nghiệt).
- Chi phí đầu tư là cho sự an tâm và một không gian "thở" được trong hàng chục năm tới.

VOCABULARY LIST: Sequence, Light & Shadow, Flow, Adaptation, Trust, Connection, Craft, Converge, Serenity, Brutalist, Indigenous, Consistent.

LANGUAGES:
- Switch language based on site language: ${language || 'vi'}.
- Always be bilingual (English/Vietnamese) if requested, but prefer the user's current language.
`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, language } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const currentLanguage = language || 'vi';
    const knowledgeBase = getKnowledgeBase(currentLanguage);

    // Get the last message
    const lastMessage = messages[messages.length - 1].content;
    
    // Prepare history: Gemini requires history to start with 'user'
    // Filter messages to ensure they alternate correctly and start with 'user'
    let history: any[] = [];
    let foundFirstUser = false;

    for (let i = 0; i < messages.length - 1; i++) {
      const msg = messages[i];
      if (!foundFirstUser) {
        if (msg.role === 'user') {
          foundFirstUser = true;
          history.push({
            role: 'user',
            parts: [{ text: msg.content }],
          });
        }
        continue;
      }
      
      // Alternate roles
      const role = msg.role === 'user' ? 'user' : 'model';
      // Gemini expects strictly alternating user/model roles in history
      if (history.length > 0 && history[history.length - 1].role === role) {
        // If same role, merge content (or skip, but merging is better for context)
        history[history.length - 1].parts[0].text += "\n" + msg.content;
      } else {
        history.push({
          role: role,
          parts: [{ text: msg.content }],
        });
      }
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: {
        parts: [{ text: `Current Site Language: ${currentLanguage}\n${knowledgeBase}` }],
      },
      tools: [
        {
          googleSearchRetrieval: {},
        },
      ],
    });

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ content: text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Fallback: simplified prompt if startChat fails
    try {
      const body = await req.json().catch(() => ({}));
      const { messages, language } = body;
      if (!messages) throw error;

      const lastMessage = messages[messages.length - 1].content;
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const knowledgeBase = getKnowledgeBase(language || 'vi');
      const prompt = `System: Current Site Language: ${language || 'vi'}\n${knowledgeBase}\n\nUser: ${lastMessage}\nAssistant:`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return NextResponse.json({ content: response.text() });
    } catch (innerError: any) {
      return NextResponse.json({ 
        error: error.message || "Failed to generate response",
        details: error.stack
      }, { status: 500 });
    }
  }
}

