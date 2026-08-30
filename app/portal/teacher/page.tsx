import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { readPortalSession } from "@/lib/portal-session";
import { supabaseAdmin } from "@/lib/supabase";
import styles from "../portal.module.css";
import TeacherPanel from "./teacher-panel";
export const dynamic="force-dynamic";
export default async function TeacherPage(){const s=readPortalSession((await cookies()).get("gsss_portal")?.value);if(!s||s.role!=="teacher")redirect("/portal/login");const db=supabaseAdmin();const {data:profile}=db?await db.from("school_users").select("full_name,employee_id,subject").eq("id",s.id).single():{data:null};return <main className={styles.dash}><header className={styles.top}><div className={styles.topinner}><div><b>GSSS GHATLA</b><div>शिक्षक पोर्टल · {profile?.full_name||s.email}</div></div><Link href="/api/portal/logout">लॉग आउट</Link></div></header><TeacherPanel/></main>}
