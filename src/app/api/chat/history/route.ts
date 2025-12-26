import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const deviceId = searchParams.get('deviceId');
  const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

  if (!deviceId) {
    return NextResponse.json({ error: "Missing deviceId" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('chat_history')
      .select('role, content, created_at')
      .or(`device_id.eq.${deviceId},ip_address.eq.${ipAddress}`)
      .order('created_at', { ascending: true })
      .limit(50);

    if (error) throw error;

    const messages = data.map(msg => ({
      role: msg.role === 'model' ? 'assistant' : 'user',
      content: msg.content
    }));

    return NextResponse.json({ messages });
  } catch (error: any) {
    console.error("Fetch history error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
