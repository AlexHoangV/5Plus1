import { NextResponse } from "next/server";
import { processChatMessage } from "@/lib/chatbot";

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { messages, language = 'vi', deviceId, sessionId } = body;
  const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

  try {
    const result = await processChatMessage({
      messages,
      language,
      deviceId,
      sessionId,
      ipAddress
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Chat API Route Error:", error);
    const isLeaked = error.message?.includes("leaked");
    const isQuota = error.message?.includes("429");

    return NextResponse.json({ 
      error: isLeaked ? "API Key Leaked" : (isQuota ? "Quota Exceeded" : "Internal Error"),
      content: language === 'en' 
        ? "I apologize, I'm experiencing some connectivity issues. Please try again in a moment."
        : "Thật xin lỗi, tôi đang gặp chút gián đoạn kết nối. Vui lòng thử lại sau giây lát."
    }, { status: 500 });
  }
}
