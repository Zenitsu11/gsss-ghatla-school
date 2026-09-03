import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as XLSX from "xlsx";
import { supabaseAdmin } from "@/lib/supabase";
import { validSession } from "@/lib/session";

const text = (v: unknown) => (v === undefined || v === null ? "" : String(v).trim());

export async function POST(req: Request) {
  if (!validSession((await cookies()).get("gsss_admin")?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Excel file is required" }, { status: 400 });

  const bytes = new Uint8Array(await file.arrayBuffer());
  const workbook = XLSX.read(bytes, { type: "array", cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

  const records = rows.map((r) => {
    const admission = r.DOA;
    let admission_date: string | null = null;
    if (admission instanceof Date && !Number.isNaN(admission.getTime())) admission_date = admission.toISOString().slice(0, 10);
    else if (text(admission)) admission_date = text(admission).slice(0, 10);
    return {
      sr_no: text(r.SRNO),
      full_name: text(r.Name),
      class_name: text(r.Class),
      section: text(r.Section) || null,
      roll_number: text(r.ClassRollNo) || null,
      admission_date,
      active: true,
      updated_at: new Date().toISOString(),
    };
  }).filter((x) => x.sr_no && x.full_name && x.class_name);

  if (!records.length) return NextResponse.json({ error: "No valid student rows found. Expected columns: Class, Section, SRNO, Name, ClassRollNo, DOA." }, { status: 400 });

  const { error } = await db.from("students").upsert(records, { onConflict: "sr_no" });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, imported: records.length });
}
