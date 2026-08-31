import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { readProducts, writeProducts } from "@/lib/store";
import { parseProductInput, touchProduct } from "@/lib/validate";

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
