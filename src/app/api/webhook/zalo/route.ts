import { NextResponse } from "next/server";
import { processChatMessage } from "@/lib/chatbot";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("Zalo Webhook Received:", JSON.stringify(body, null, 2));

  // Zalo Webhook events: user_send_text, user_send_image, etc.
  const { event_name, sender, message, recipient } = body;

    if (event_name === "user_send_text") {
      const userId = sender.id;
      const userText = message.text;

      try {
        // Process with Gemini - now with history retrieval enabled by deviceId
        const result = await processChatMessage({
          messages: [{ role: 'user', content: userText }],
          deviceId: `zalo_${userId}`,
          sessionId: `zalo_session_${userId}`,
          ipAddress: 'zalo_internal'
        });

        // Send reply back to Zalo
        await sendZaloMessage(userId, result.content);
        console.log(`Zalo reply sent to ${userId}`);
      } catch (error: any) {
        console.error("Zalo processing error:", error);
        await sendZaloMessage(userId, "Xin lỗi, tôi đang gặp gián đoạn kết nối. Vui lòng thử lại sau.");
      }
    }


  return NextResponse.json({ status: "success" });
}

async function sendZaloMessage(userId: string, text: string) {
  const accessToken = process.env.ZALO_OA_ACCESS_TOKEN;
  if (!accessToken) {
    console.error("ZALO_OA_ACCESS_TOKEN is not set");
    return;
  }

  const response = await fetch("https://openapi.zalo.me/v3.0/oa/message/cs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "access_token": accessToken
    },
    body: JSON.stringify({
      recipient: { user_id: userId },
      message: { text }
    })
  });

  const result = await response.json();
  if (result.error !== 0) {
    console.error("Zalo API Error:", result);
  }
}
