import "server-only";
import { head, put } from "@vercel/blob";
import type { Product } from "./types";

const DATA_PATH = "data/products.json";
// Blob edge cache ขั้นต่ำ 60 วิ — อ่านผ่าน query cache-bust เพื่อให้ข้อมูลสดเสมอ
const CACHE_MAX_AGE = 60;

export async function readProducts(): Promise<Product[]> {
  try {
    const meta = await head(DATA_PATH);
    const res = await fetch(`${meta.url}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as Product[];
    if (!Array.isArray(data)) return [];
    return data.map((p) => ({ ...p, category: p.category ?? "recommended" }));
  } catch {
    // ยังไม่มีไฟล์ข้อมูล (ร้านใหม่) — เริ่มจากรายการว่าง
    return [];
  }
}

export async function writeProducts(products: Product[]): Promise<void> {
  await put(DATA_PATH, JSON.stringify(products), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    addRandomSuffix: false,
    cacheControlMaxAge: CACHE_MAX_AGE,
  });
}
