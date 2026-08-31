import { CATEGORY_ORDER, STATUS_ORDER, type Product, type ProductCategory, type ProductStatus } from "./types";

const MAX_DETAILS = 30;
const MAX_IMAGES = 30;
const MAX_TEXT_LEN = 200;

export type ProductInput = {
  ep: string;
  price: number;
  details: string[];
  images: string[];
  status: ProductStatus;
  category: ProductCategory;
};

export function parseProductInput(body: unknown): ProductInput | string {
  if (typeof body !== "object" || body === null) return "ข้อมูลไม่ถูกต้อง";
  const b = body as Record<string, unknown>;

  const ep = typeof b.ep === "string" ? b.ep.trim().toUpperCase().replace(/\s+/g, "") : "";
  if (!/^EP[0-9A-Z-]{1,20}$/.test(ep)) return "รหัส EP ต้องขึ้นต้นด้วย EP ตามด้วยตัวเลข เช่น EP6431";

  const price = Number(b.price);
  if (!Number.isFinite(price) || price < 0 || price > 10_000_000) return "ราคาไม่ถูกต้อง";

  const details = Array.isArray(b.details)
    ? b.details
        .filter((d): d is string => typeof d === "string")
        .map((d) => d.trim().slice(0, MAX_TEXT_LEN))
        .filter(Boolean)
        .slice(0, MAX_DETAILS)
    : [];

  const images = Array.isArray(b.images)
    ? b.images
        .filter((u): u is string => typeof u === "string")
        .filter((u) => /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\//.test(u))
        .slice(0, MAX_IMAGES)
    : [];

  const status = STATUS_ORDER.includes(b.status as ProductStatus) ? (b.status as ProductStatus) : "available";
  const category = CATEGORY_ORDER.includes(b.category as ProductCategory)
    ? (b.category as ProductCategory)
    : "recommended";

  return { ep, price: Math.round(price), details, images, status, category };
}

export function touchProduct(input: ProductInput, existing?: Product): Product {
  const now = new Date().toISOString();
  return {
    ...input,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}
