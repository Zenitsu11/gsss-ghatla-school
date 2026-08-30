import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { readPortalSession } from "@/lib/portal-session";
export async function GET(){const s=readPortalSession((await cookies()).get("gsss_portal")?.value);if(!s||s.role!=="teacher")return NextResponse.json({error:"Teacher access required"},{status:403});const db=supabaseAdmin();if(!db)return NextResponse.json({error:"Supabase not configured"},{status:500});const {data,error}=await db.from("school_users").select("id,full_name,email,class_name,roll_number").eq("role","student").order("class_name").order("roll_number");if(error)return NextResponse.json({error:error.message},{status:500});return NextResponse.json({items:data||[]});}
