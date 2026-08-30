import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { validSession } from "@/lib/session";
import { type SiteContent } from "@/lib/site-content";
import { getContent, saveContent } from "@/lib/content-store";
export const runtime = "nodejs";
export async function GET(){return NextResponse.json(await getContent())}
export async function PUT(request:Request){const store=await cookies();if(!validSession(store.get("gsss_admin")?.value))return NextResponse.json({error:"अनधिकृत अनुरोध"},{status:401});const body=await request.json() as SiteContent;if(!body.schoolName||!body.email||!Array.isArray(body.notices)||!Array.isArray(body.activities))return NextResponse.json({error:"कृपया सभी आवश्यक जानकारी भरें।"},{status:400});await saveContent(body);return NextResponse.json({ok:true})}
