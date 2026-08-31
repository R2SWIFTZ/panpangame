import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "pp_admin";

function sign(value: string): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function makeSessionToken(): string {
  return sign("panpangame-admin");
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const expected = makeSessionToken();
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isAdminRequest(): Promise<boolean> {
  const jar = await cookies();
  return isValidSessionToken(jar.get(ADMIN_COOKIE)?.value);
}
