import fs from "fs/promises";
import path from "path";
import { defaultContent, type SiteContent } from "./site-content";
import { supabaseAdmin } from "./supabase";
const file = path.join(process.cwd(), "data", "site.json");
export async function getContent(): Promise<SiteContent> { const db=supabaseAdmin(); if(db){const {data}=await db.from("site_content").select("content").eq("id",1).maybeSingle();if(data?.content)return {...defaultContent,...data.content} as SiteContent} try{return {...defaultContent,...JSON.parse(await fs.readFile(file, "utf8"))} as SiteContent}catch{return defaultContent} }
export async function saveContent(content: SiteContent) { const db=supabaseAdmin();if(db){const {error}=await db.from("site_content").upsert({id:1,content,updated_at:new Date().toISOString()});if(error)throw error;return}await fs.writeFile(file,JSON.stringify(content,null,2),"utf8"); }
