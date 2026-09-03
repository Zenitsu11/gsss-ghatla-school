"use server";

import { cookies } from "next/headers";
import { readPortalSession } from "@/lib/portal-session";
import { supabaseAdmin } from "@/lib/supabase";

type ActionState = { ok: boolean; message: string };

async function getTeacher() {
  const cookieValue = (await cookies()).get("gsss_portal")?.value;
  const session = readPortalSession(cookieValue);
  if (!session) return { error: "Unauthorized" as const };
  if (session.role !== "teacher") return { error: "Teacher access required" as const };

  const db = supabaseAdmin();
  if (!db) return { error: "Supabase not configured" as const };

  const { data: profile, error } = await db
    .from("school_users")
    .select("id,role,email")
    .eq("id", session.id)
    .maybeSingle();

  if (profileErrorMessage(error) || !profile || profile.role !== "teacher") {
    return { error: "Teacher access required" as const };
  }

  return { db, profile };
}

function profileErrorMessage(error: { message?: string } | null) {
  return Boolean(error?.message);
}

export async function markAttendance(formData: FormData): Promise<ActionState> {
  const teacher = await getTeacher();
  if ("error" in teacher) return { ok: false, message: teacher.error };

  const studentId = String(formData.get("studentId") || "");
  const attendanceDate = String(formData.get("attendanceDate") || "");
  const status = String(formData.get("status") || "");
  const note = String(formData.get("note") || "");

  if (!studentId || !attendanceDate || !status) {
    return { ok: false, message: "Student, date and status are required" };
  }

  const { error } = await teacher.db.from("attendance").upsert(
    {
      student_id: studentId,
      attendance_date: attendanceDate,
      status,
      marked_by: teacher.profile.id,
      note: note || null,
    },
    { onConflict: "student_id,attendance_date" },
  );

  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "उपस्थिति सुरक्षित हो गई।" };
}

export async function addHomework(formData: FormData): Promise<ActionState> {
  const teacher = await getTeacher();
  if ("error" in teacher) return { ok: false, message: teacher.error };

  const title = String(formData.get("title") || "");
  const description = String(formData.get("description") || "");
  const subject = String(formData.get("subject") || "");
  const className = String(formData.get("className") || "");
  const dueDate = String(formData.get("dueDate") || "");

  if (!title || !description || !subject || !className) {
    return { ok: false, message: "Title, description, subject and class are required" };
  }

  const { error } = await teacher.db.from("homework").insert({
    title,
    description,
    subject,
    class_name: className,
    due_date: dueDate || null,
    teacher_id: teacher.profile.id,
    attachment_url: null,
  });

  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "गृहकार्य प्रकाशित हो गया।" };
}
