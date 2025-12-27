import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

function stripAccents(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function expandQuery(query: string): string {
  const raw = (query || "").trim();
  if (!raw) return "";

  const qLower = raw.toLowerCase();
  const qAscii = stripAccents(qLower);

  const mapping: Record<string, string[]> = {
    "dich vu": ["services", "service"],
    "lien he": ["contact", "email", "phone", "address"],
    "du an": ["projects", "project"],
    "gioi thieu": ["about"],
    "kien truc": ["architectural", "architecture"],
    "noi that": ["interior"],
    "quy hoach": ["urbanism", "planning"],
  };

  const extra: string[] = [];
  for (const [k, vals] of Object.entries(mapping)) {
    if (qAscii.includes(k)) {
      extra.push(...vals);
    }
  }

  const parts = [raw];
  if (qAscii !== qLower) parts.push(qAscii);
  if (extra.length > 0) parts.push([...new Set(extra)].sort().join(" "));

  return parts.join(" ");
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const q = url.searchParams.get("q") || "";
    const k = Math.min(Math.max(parseInt(url.searchParams.get("k") || "5"), 1), 12);

    if (!q.trim()) {
      return NextResponse.json({ query: q, results: [] });
    }

    const expandedQuery = expandQuery(q);
    const tsQuery = expandedQuery.split(/\s+/).filter(Boolean).join(" | ");

    const { data, error } = await supabase.rpc("search_kb_chunks", {
      search_query: tsQuery,
      match_count: k,
    });

    if (error) {
      const { data: fallbackData } = await supabase
        .from("kb_chunks")
        .select("id, doc_id, title, source, content")
        .ilike("content", `%${q}%`)
        .limit(k);

      return NextResponse.json({
        query: q,
        results: (fallbackData || []).map((r: any) => ({
          doc_id: r.doc_id,
          title: r.title,
          source: r.source,
          content: r.content,
          score: 0,
        })),
      });
    }

    return NextResponse.json({
      query: q,
      results: (data || []).map((r: any) => ({
        doc_id: r.doc_id,
        title: r.title,
        source: r.source,
        content: r.content,
        score: r.rank,
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
