import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { supabaseAuth } from "@/lib/supabase-auth";
import { createPortalSession } from "@/lib/portal-session";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) return NextResponse.json({ error: "ई-मेल और पासवर्ड आवश्यक हैं।" }, { status: 400 });

  const auth = supabaseAuth();
  const admin = supabaseAdmin();
  if (!auth || !admin) return NextResponse.json({ error: "Portal authentication is not configured. Add NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel." }, { status: 500 });

  const { data, error } = await auth.auth.signInWithPassword({
    email: String(email).trim().toLowerCase(),
    password: String(password),
  });
  if (error || !data.user || !data.session?.access_token) {
    return NextResponse.json({ error: "ई-मेल या पासवर्ड गलत है।" }, { status: 401 });
  }

  const { data: profile } = await admin
    .from("school_users")
    .select("id,role,email")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile || (profile.role !== "teacher" && profile.role !== "student")) {
    return NextResponse.json({ error: "इस खाते का विद्यालय प्रोफ़ाइल उपलब्ध नहीं है।" }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true, role: profile.role });
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 12,
    path: "/",
  };

  // Keep the portal cookie for compatibility, but use the Supabase access token
  // as the authoritative server-side authentication credential.
  response.cookies.set("gsss_portal", createPortalSession({ id: profile.id, role: profile.role, email: profile.email }), cookieOptions);
  response.cookies.set("gsss_access_token", data.session.access_token, cookieOptions);

  return response;
}
