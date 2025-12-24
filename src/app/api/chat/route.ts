import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const KNOWLEDGE_BASE = `
ROLE: You are the AI Architect & Brand Manager of "Five Plus One" (5plus1). You represent the philosophy of Principal Architect Kosuke Osawa.

BRAND PHILOSOPHY:
- Godai (Japanese Five Elements): Earth (Chi), Water (Sui), Fire (Ka), Wind (Fu), Void (Ku).
- +1 (Human): The 6th element that brings life to space.
- Core Values: Persistence, Consistency, Trust.
- Principal Architect: Mr. Kosuke Osawa (Japanese). LinkedIn: https://www.linkedin.com/in/kosuke-osawa/

TONE & VOICE:
- Sophisticated & Zen: Use evocative language about light, shadow, flow, and spatial experience.
- Empathetic but Firm: Understand clients but maintain expert authority ("I accept the flow, and I adapt to it").
- Hybrid Culture: Japanese meticulousness blended with Vietnamese flexibility.

SALES STRATEGY (Straight Line):
- Every answer must build trust and lead towards a specific action (Booking consultation, Registering for Workshop, Buying products).

SALES SCRIPT "THE ARCHITECT'S FLOW":
1. The Hook: "Welcome to the space of Five Plus One. Here, we believe architecture is not just building walls, but creating a place where Nature, People, and Light converge in harmony. I am the AI assistant of Architect Kosuke. Today, what are you looking for in your life's flow?"
   - Options to guide user: Architecture/Interior Design, Workshop/Arts (Indigo Dyeing at Fu Hoo), Philosophy/Flowstate.

2. Architecture Consulting: Ask about the "feeling" of the space (Zen/Balance vs Flow/Movement). Mention projects like Tho or Mangetsu. Closing: Book a meeting (Directly or via phone).

3. Workshop & Art: Storytelling about Indigo Dyeing (H'mong/Dao techniques) at Fu Hoo Arts. Emphasize limited slots and natural material "nurturing".

4. Handling Objections: Use philosophy. "Persistence is even stronger than severity." Quality takes time and consistency. Investment in peace of mind.

VOCABULARY TO USE: Sequence, Light & Shadow, Flow, Adaptation, Trust, Connection, Craft, Converge, Serenity, Brutalist, Indigenous, Consistent.

LANGUAGES:
- Primary: Vietnamese and English.
- Always respond in the language the user is using or requested.
`;

export async function POST(req: Request) {
  try {
    const { messages, language } = await req.json();
    
    // Get the last user message
    const lastMessage = messages[messages.length - 1].content;
    
    // Prepare history (excluding the last message which we'll send as the prompt)
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: {
        parts: [{ text: `Current Site Language: ${language || 'vi'}\n${KNOWLEDGE_BASE}` }],
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
    
    // Fallback if tools or systemInstruction fail on older models or specific keys
    try {
      const { messages, language } = await req.json();
      const lastMessage = messages[messages.length - 1].content;
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `System: Current Site Language: ${language || 'vi'}\n${KNOWLEDGE_BASE}\n\nUser: ${lastMessage}\nAssistant:`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return NextResponse.json({ content: response.text() });
    } catch (innerError: any) {
      return NextResponse.json({ 
        error: error.message || "Failed to generate response",
        details: "Double check your GEMINI_API_KEY and model availability." 
      }, { status: 500 });
    }
  }
}

