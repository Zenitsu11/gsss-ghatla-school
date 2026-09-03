import fs from "fs/promises";
import path from "path";
import { defaultContent, type SiteContent } from "./site-content";
import { supabaseAdmin } from "./supabase";

const file = path.join(process.cwd(), "data", "site.json");
const SUN_NAMASKAR_MIGRATION = "sun-namaskar-activity-v1";

type StoredContent = SiteContent & { _migrations?: string[] };

export async function getContent(): Promise<SiteContent> {
  const db = supabaseAdmin();
  if (db) {
    const { data } = await db.from("site_content").select("content").eq("id", 1).maybeSingle();
    if (data?.content) {
      const stored = data.content as StoredContent;
      const merged = { ...defaultContent, ...stored } as StoredContent;
      const migrations = [...(stored._migrations || [])];
      if (!migrations.includes(SUN_NAMASKAR_MIGRATION)) {
        const activities = [...(merged.activities || [])];
        if (!activities.includes("सूर्य नमस्कार")) activities.splice(Math.min(2, activities.length), 0, "सूर्य नमस्कार");
        migrations.push(SUN_NAMASKAR_MIGRATION);
        merged.activities = activities;
        merged._migrations = migrations;
        await db.from("site_content").upsert({ id: 1, content: merged, updated_at: new Date().toISOString() });
      }
      return merged as SiteContent;
    }
  }
  try {
    return { ...defaultContent, ...JSON.parse(await fs.readFile(file, "utf8")) } as SiteContent;
  } catch {
    return defaultContent;
  }
}

export async function saveContent(content: SiteContent) {
  const db = supabaseAdmin();
  if (db) {
    const { error } = await db.from("site_content").upsert({ id: 1, content, updated_at: new Date().toISOString() });
    if (error) throw error;
    return;
  }
  await fs.writeFile(file, JSON.stringify(content, null, 2), "utf8");
}
