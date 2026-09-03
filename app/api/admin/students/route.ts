import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { validSession } from "@/lib/session";

async function requireAdmin() {
  return validSession((await cookies()).get("gsss_admin")?.value);
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  const { data, error } = await db.from("students").select("id,sr_no,full_name,class_name,section,roll_number,admission_date,active").order("class_name").order("roll_number");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data || [] });
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  const payload = {
    sr_no: String(body.sr_no || "").trim(),
    full_name: String(body.full_name || "").trim(),
    class_name: String(body.class_name || "").trim(),
    section: body.section ? String(body.section).trim() : null,
    roll_number: body.roll_number ? String(body.roll_number).trim() : null,
    admission_date: body.admission_date || null,
    active: body.active !== false,
  };
  if (!payload.sr_no || !payload.full_name || !payload.class_name) return NextResponse.json({ error: "sr_no, full_name and class_name are required" }, { status: 400 });
  const { data, error } = await db.from("students").insert(payload).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ item: data }, { status: 201 });
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  const allowed = ["sr_no", "full_name", "class_name", "section", "roll_number", "admission_date", "active"] as const;
  const payload: Record<string, unknown> = {};
  for (const key of allowed) if (key in body) payload[key] = body[key];
  payload.updated_at = new Date().toISOString();
  const { data, error } = await db.from("students").update(payload).eq("id", body.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ item: data });
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  const { error } = await db.from("students").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
