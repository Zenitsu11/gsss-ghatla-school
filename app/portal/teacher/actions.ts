"use server";

import { cookies } from "next/headers";
import { readPortalSession } from "@/lib/portal-session";
import { supabaseAdmin } from "@/lib/supabase";

type AttendanceInput = {
  studentId: string;
  attendanceDate: string;
  status: string;
  note: string;
};

type HomeworkInput = {
  title: string;
  description: string;
  subject: string;
  className: string;
  dueDate: string;
};

async function getTeacher() {
  const session = readPortalSession((await cookies()).get("gsss_portal")?.value);
  if (!session) return { error: "Unauthorized" as const };
  if (session.role !== "teacher") return { error: "Teacher access required" as const };

  const db = supabaseAdmin();
  if (!db) return { error: "Supabase not configured" as const };

  const { data: profile, error } = await db
    .from("school_users")
    .select("id,role,email")
    .eq("id", session.id)
    .maybeSingle();

  if (error || !profile || profile.role !== "teacher") {
    return { error: "Teacher access required" as const };
  }

  return { db, profile };
}

export async function markAttendance(input: AttendanceInput) {
  const teacher = await getTeacher();
  if ("error" in teacher) return { ok: false, error: teacher.error };

  if (!input.studentId || !input.attendanceDate || !input.status) {
    return { ok: false, error: "Student, date and status are required" };
  }

  const { error } = await teacher.db.from("attendance").upsert(
    {
      student_id: input.studentId,
      attendance_date: input.attendanceDate,
      status: input.status,
      marked_by: teacher.profile.id,
      note: input.note || null,
    },
    { onConflict: "student_id,attendance_date" },
  );

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function addHomework(input: HomeworkInput) {
  const teacher = await getTeacher();
  if ("error" in teacher) return { ok: false, error: teacher.error };

  if (!input.title || !input.description || !input.subject || !input.className) {
    return { ok: false, error: "Title, description, subject and class are required" };
  }

  const { error } = await teacher.db.from("homework").insert({
    title: input.title,
    description: input.description,
    subject: input.subject,
    class_name: input.className,
    due_date: input.dueDate || null,
    teacher_id: teacher.profile.id,
    attachment_url: null,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
