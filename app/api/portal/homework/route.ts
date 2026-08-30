import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { readPortalSession } from "@/lib/portal-session";

export async function GET(){const s=readPortalSession((await cookies()).get("gsss_portal")?.value);if(!s)return NextResponse.json({error:"Unauthorized"},{status:401});const db=supabaseAdmin();if(!db)return NextResponse.json({error:"Supabase not configured"},{status:500});const q=s.role==="student"?db.from("homework").select("*").eq("class_name",(await db.from("school_users").select("class_name").eq("id",s.id).single()).data?.class_name||"").order("due_date",{ascending:true}):db.from("homework").select("*").order("created_at",{ascending:false});const {data,error}=await q;if(error)return NextResponse.json({error:error.message},{status:500});return NextResponse.json({items:data||[]});}

export async function POST(request:Request){const s=readPortalSession((await cookies()).get("gsss_portal")?.value);if(!s||s.role!=="teacher")return NextResponse.json({error:"Teacher access required"},{status:403});const db=supabaseAdmin();if(!db)return NextResponse.json({error:"Supabase not configured"},{status:500});const body=await request.json();const {error}=await db.from("homework").insert({title:body.title,description:body.description,subject:body.subject,class_name:body.className,due_date:body.dueDate||null,teacher_id:s.id,attachment_url:body.attachmentUrl||null});if(error)return NextResponse.json({error:error.message},{status:400});return NextResponse.json({ok:true});}
