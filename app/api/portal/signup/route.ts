import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const { fullName, email, password, className, rollNumber } = await request.json();
  if (!fullName || !email || !password || !className) return NextResponse.json({ error: "नाम, ई-मेल, कक्षा और पासवर्ड आवश्यक हैं।" }, { status: 400 });
  if (String(password).length < 8) return NextResponse.json({ error: "पासवर्ड कम से कम 8 अक्षरों का रखें।" }, { status: 400 });
  const admin = supabaseAdmin();
  if (!admin) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  const { data, error } = await admin.auth.admin.createUser({ email: String(email).trim().toLowerCase(), password: String(password), email_confirm: true, user_metadata: { full_name: fullName, role: "student" } });
  if (error || !data.user) return NextResponse.json({ error: error?.message || "खाता नहीं बनाया जा सका।" }, { status: 400 });
  const { error: profileError } = await admin.from("school_users").insert({ id: data.user.id, role: "student", full_name: fullName, email: data.user.email, class_name: className, roll_number: rollNumber || null });
  if (profileError) { await admin.auth.admin.deleteUser(data.user.id); return NextResponse.json({ error: "विद्यार्थी प्रोफ़ाइल नहीं बन सकी।" }, { status: 500 }); }
  return NextResponse.json({ ok: true });
}
