"use server";

import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { supabaseAuth } from "@/lib/supabase-auth";

type ActionState = { ok: boolean; message: string };
type TeacherAuth =
  | { error: string }
  | { db: NonNullable<ReturnType<typeof supabaseAdmin>>; profile: { id: string; role: "teacher"; email: string | null } };

async function getTeacher(): Promise<TeacherAuth> {
  const token = (await cookies()).get("gsss_access_token")?.value;
  if (!token) return { error: "Unauthorized" };

  const auth = supabaseAuth();
  const db = supabaseAdmin();
  if (!auth || !db) return { error: "Supabase not configured" };

  const { data, error: authError } = await auth.auth.getUser(token);
  if (authError || !data.user) return { error: "Unauthorized" };

  const { data: profile, error } = await db
    .from("school_users")
    .select("id,role,email")
    .eq("id", data.user.id)
    .maybeSingle();

  if (error || !profile || profile.role !== "teacher") return { error: "Teacher access required" };
  return { db, profile: { id: profile.id, role: "teacher", email: profile.email } };
}

export async function markAttendance(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const teacher = await getTeacher();
  if ("error" in teacher) return { ok: false, message: teacher.error };
  const studentId = String(formData.get("studentId") || "");
  const attendanceDate = String(formData.get("attendanceDate") || "");
  const status = String(formData.get("status") || "");
  const note = String(formData.get("note") || "");
  if (!studentId || !attendanceDate || !status) return { ok: false, message: "Student, date and status are required" };
  const { error } = await teacher.db.from("attendance").upsert(
    { student_id: studentId, attendance_date: attendanceDate, status, marked_by: teacher.profile.id, note: note || null },
    { onConflict: "student_id,attendance_date" },
  );
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "उपस्थिति सुरक्षित हो गई।" };
}

export async function addHomework(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const teacher = await getTeacher();
  if ("error" in teacher) return { ok: false, message: teacher.error };
  const title = String(formData.get("title") || "");
  const description = String(formData.get("description") || "");
  const subject = String(formData.get("subject") || "");
  const className = String(formData.get("className") || "");
  const dueDate = String(formData.get("dueDate") || "");
  if (!title || !description || !subject || !className) return { ok: false, message: "Title, description, subject and class are required" };
  const { error } = await teacher.db.from("homework").insert({ title, description, subject, class_name: className, due_date: dueDate || null, teacher_id: teacher.profile.id, attachment_url: null });
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "गृहकार्य प्रकाशित हो गया।" };
}
