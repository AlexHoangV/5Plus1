import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

function chunkText(text: string, chunkSize = 900, overlap = 150): string[] {
  const cleaned = (text || "").trim();
  if (!cleaned) return [];
  const chunks: string[] = [];
  let i = 0;
  const n = cleaned.length;
  while (i < n) {
    const j = Math.min(n, i + chunkSize);
    const chunk = cleaned.slice(i, j).trim();
    if (chunk) chunks.push(chunk);
    i = Math.max(j - overlap, j);
  }
  return chunks;
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, source } = await request.json();
    
    if (!title || !content) {
      return NextResponse.json({ error: "Title and content required" }, { status: 400 });
    }

    const chunks = chunkText(content);

    const { data: doc, error: docError } = await supabase
      .from("kb_documents")
      .insert({ title, source, chunk_count: chunks.length })
      .select("id")
      .single();

    if (docError || !doc) {
      return NextResponse.json({ error: docError?.message || "Failed to create document" }, { status: 500 });
    }

    if (chunks.length > 0) {
      const chunkDocs = chunks.map((ch, idx) => ({
        doc_id: doc.id,
        chunk_index: idx,
        title,
        source,
        content: ch,
      }));
      
      const { error: chunkError } = await supabase.from("kb_chunks").insert(chunkDocs);
      if (chunkError) {
        await supabase.from("kb_documents").delete().eq("id", doc.id);
        return NextResponse.json({ error: chunkError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ id: doc.id, chunk_count: chunks.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "50"), 1), 200);

    const { data, error } = await supabase
      .from("kb_documents")
      .select("id, title, source, chunk_count, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
