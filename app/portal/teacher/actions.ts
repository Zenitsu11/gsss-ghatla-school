"use server";

import { headers } from "next/headers";
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

function getPortalCookie(cookieHeader: string | null) {
  if (!cookieHeader) return undefined;
  const match = cookieHeader.match(/(?:^|;\s*)gsss_portal=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

async function getTeacher() {
  // Read the raw request Cookie header in the server action. This is more reliable
  // for client-invoked Server Actions than depending on the dynamic cookie store.
  const cookieHeader = (await headers()).get("cookie");
  const session = readPortalSession(getPortalCookie(cookieHeader));
  if (!session) return { error: "Unauthorized" as const };
  if (session.role !== "teacher") return { error: "Teacher access required" as const };

  const db = supabaseAdmin();
  if (!db) return { error: "Supabase not configured" as const };

  const { data: profile, error: profileError } = await db
    .from("school_users")
    .select("id,role,email")
    .eq("id", session.id)
    .maybeSingle();

  if (profileError || !profile || profile.role !== "teacher") {
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
