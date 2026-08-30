import crypto from "crypto";

const secret = () => process.env.SESSION_SECRET || "change-this-secret-before-production";

type PortalPayload = { id: string; role: "student" | "teacher"; email: string; exp: number };

export function createPortalSession(payload: Omit<PortalPayload, "exp">) {
  const body: PortalPayload = { ...payload, exp: Date.now() + 1000 * 60 * 60 * 12 };
  const encoded = Buffer.from(JSON.stringify(body)).toString("base64url");
  const signature = crypto.createHmac("sha256", secret()).update(encoded).digest("hex");
  return `${encoded}.${signature}`;
}

export function readPortalSession(value?: string): PortalPayload | null {
  if (!value) return null;
  try {
    const [encoded, signature] = value.split(".");
    if (!encoded || !signature) return null;
    const expected = crypto.createHmac("sha256", secret()).update(encoded).digest("hex");
    if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
    const body = JSON.parse(Buffer.from(encoded, "base64url").toString()) as PortalPayload;
    return body.exp > Date.now() ? body : null;
  } catch { return null; }
}
