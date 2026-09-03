import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { readProducts, writeProducts } from "@/lib/store";
import { parseProductInput, touchProduct } from "@/lib/validate";
import type { Product } from "@/lib/types";

export async function GET() {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(await readProducts());
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const input = parseProductInput(await request.json().catch(() => null));
  if (typeof input === "string") return NextResponse.json({ error: input }, { status: 400 });

  const products = await readProducts();
  if (products.some((p) => p.ep === input.ep)) {
    return NextResponse.json({ error: `มีรหัส ${input.ep} อยู่แล้ว` }, { status: 409 });
  }
  const product = touchProduct(input);
  await writeProducts([product, ...products]);
  return NextResponse.json(product, { status: 201 });
}

// Reorder: body { order: string[] } — the full list of EPs in the new order.
// The stored array order IS the display order on the public site, so this
// just rewrites the file in that order. Rejects anything that isn't exactly
// the current set of EPs, so a stale tab can't drop or duplicate a product.
export async function PATCH(request: Request) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { order?: unknown } | null;
  const order = Array.isArray(body?.order) ? body.order.filter((x): x is string => typeof x === "string") : null;
  if (!order) return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });

  const products = await readProducts();
  const byEp = new Map(products.map((p) => [p.ep, p]));
  const sameSet = order.length === products.length && new Set(order).size === order.length && order.every((ep) => byEp.has(ep));
  if (!sameSet) return NextResponse.json({ error: "รายการไม่ตรงกับข้อมูลล่าสุด — รีเฟรชหน้าแล้วลองใหม่" }, { status: 409 });

  const next = order.map((ep) => byEp.get(ep) as Product);
  await writeProducts(next);
  return NextResponse.json({ ok: true });
}
