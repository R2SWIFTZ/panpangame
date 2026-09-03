import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { writeCategoryOrder } from "@/lib/store";
import { CATEGORY_ORDER, type ProductCategory } from "@/lib/types";

// Reorder the public filter chips: body { order: ProductCategory[] } — must be
// exactly the known category set, so a stale tab can't drop or duplicate one.
export async function PATCH(request: Request) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { order?: unknown } | null;
  const order = Array.isArray(body?.order) ? body.order.filter((x): x is string => typeof x === "string") : null;
  if (!order) return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });

  const known = new Set<string>(CATEGORY_ORDER);
  const sameSet = order.length === CATEGORY_ORDER.length && new Set(order).size === order.length && order.every((c) => known.has(c));
  if (!sameSet) return NextResponse.json({ error: "รายการหมวดไม่ตรงกับระบบ — รีเฟรชหน้าแล้วลองใหม่" }, { status: 409 });

  await writeCategoryOrder(order as ProductCategory[]);
  return NextResponse.json({ ok: true });
}
