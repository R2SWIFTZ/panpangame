import "server-only";
import { head, put } from "@vercel/blob";
import { CATEGORY_ORDER, type Product, type ProductCategory } from "./types";

const DATA_PATH = "data/products.json";
const SETTINGS_PATH = "data/settings.json";
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

// ลำดับหมวดที่ admin จัดไว้ — ใช้เรียงชิปกรองบนหน้าเว็บ. ทำให้ทนต่อการเพิ่ม/ลบ
// หมวดในโค้ด: หมวดที่ไม่รู้จักถูกทิ้ง หมวดที่ยังไม่มีในลำดับต่อท้ายตาม CATEGORY_ORDER
export function normalizeCategoryOrder(raw: unknown): ProductCategory[] {
  const known = new Set<string>(CATEGORY_ORDER);
  const seen = new Set<ProductCategory>();
  const out: ProductCategory[] = [];
  if (Array.isArray(raw)) {
    for (const x of raw) {
      if (typeof x === "string" && known.has(x) && !seen.has(x as ProductCategory)) {
        seen.add(x as ProductCategory);
        out.push(x as ProductCategory);
      }
    }
  }
  for (const c of CATEGORY_ORDER) if (!seen.has(c)) out.push(c);
  return out;
}

export async function readCategoryOrder(): Promise<ProductCategory[]> {
  try {
    const meta = await head(SETTINGS_PATH);
    const res = await fetch(`${meta.url}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return [...CATEGORY_ORDER];
    const data = (await res.json()) as { categoryOrder?: unknown };
    return normalizeCategoryOrder(data?.categoryOrder);
  } catch {
    return [...CATEGORY_ORDER];
  }
}

export async function writeCategoryOrder(order: ProductCategory[]): Promise<void> {
  await put(SETTINGS_PATH, JSON.stringify({ categoryOrder: order }), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    addRandomSuffix: false,
    cacheControlMaxAge: CACHE_MAX_AGE,
  });
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
