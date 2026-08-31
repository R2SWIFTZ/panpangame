import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { isAdminRequest } from "@/lib/auth";
import { readProducts, writeProducts } from "@/lib/store";
import { parseProductInput, touchProduct } from "@/lib/validate";

async function deleteBlobs(urls: string[]) {
  if (urls.length === 0) return;
  try {
    await del(urls);
  } catch {
    // ลบรูปไม่สำเร็จไม่ควรทำให้บันทึกข้อมูลล้ม — รูปกำพร้าลบทีหลังได้
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ ep: string }> }) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { ep } = await params;
  const target = decodeURIComponent(ep).toUpperCase();

  const input = parseProductInput(await request.json().catch(() => null));
  if (typeof input === "string") return NextResponse.json({ error: input }, { status: 400 });

  const products = await readProducts();
  const index = products.findIndex((p) => p.ep === target);
  if (index === -1) return NextResponse.json({ error: "ไม่พบรหัสนี้" }, { status: 404 });
  if (input.ep !== target && products.some((p) => p.ep === input.ep)) {
    return NextResponse.json({ error: `มีรหัส ${input.ep} อยู่แล้ว` }, { status: 409 });
  }

  const existing = products[index];
  const updated = touchProduct(input, existing);
  const next = [...products.slice(0, index), updated, ...products.slice(index + 1)];
  await writeProducts(next);

  const removedImages = existing.images.filter((u) => !input.images.includes(u));
  await deleteBlobs(removedImages);
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ ep: string }> }) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { ep } = await params;
  const target = decodeURIComponent(ep).toUpperCase();

  const products = await readProducts();
  const existing = products.find((p) => p.ep === target);
  if (!existing) return NextResponse.json({ error: "ไม่พบรหัสนี้" }, { status: 404 });

  await writeProducts(products.filter((p) => p.ep !== target));
  await deleteBlobs(existing.images);
  return NextResponse.json({ ok: true });
}
