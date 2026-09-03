import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { supabaseAuth } from "@/lib/supabase-auth";
import styles from "../portal.module.css";
import TeacherPanel from "./teacher-panel";

export const dynamic = "force-dynamic";

export default async function TeacherPage() {
  const token = (await cookies()).get("gsss_access_token")?.value;
  const auth = supabaseAuth();
  const db = supabaseAdmin();
  if (!token || !auth || !db) redirect("/portal/login");

  const { data, error } = await auth.auth.getUser(token);
  if (error || !data.user) redirect("/portal/login");

  const { data: profile } = await db
    .from("school_users")
    .select("full_name,employee_id,subject,role,email")
    .eq("id", data.user.id)
    .single();

  if (!profile || profile.role !== "teacher") redirect("/portal/login");

  return (
    <main className={styles.dash}>
      <header className={styles.top}>
        <div className={styles.topinner}>
          <div><b>GSSS GHATLA</b><div>शिक्षक पोर्टल · {profile.full_name || profile.email}</div></div>
          <Link href="/api/portal/logout">लॉग आउट</Link>
        </div>
      </header>
      <TeacherPanel />
    </main>
  );
}
