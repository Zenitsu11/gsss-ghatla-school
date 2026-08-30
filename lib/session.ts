import crypto from "crypto";
const secret = () => process.env.SESSION_SECRET || "change-this-secret-before-production";
export function createSession(email: string) { const signature = crypto.createHmac("sha256", secret()).update(email).digest("hex"); return Buffer.from(`${email}.${signature}`).toString("base64url"); }
export function validSession(value?: string) { if (!value) return false; try { const [email, signature] = Buffer.from(value, "base64url").toString().split("."); const expected = crypto.createHmac("sha256", secret()).update(email).digest("hex"); return signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected)); } catch { return false; } }
