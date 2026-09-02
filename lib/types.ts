export type ProductStatus = "available" | "reserved" | "installment" | "sold";

export type ProductCategory = "recommended" | "rare" | "budget" | "flag" | "thousand" | "girl";

export type Product = {
  ep: string; // รหัสสินค้า เช่น "EP6431"
  price: number; // 0 = สอบถามราคา
  details: string[];
  images: string[];
  status: ProductStatus;
  category: ProductCategory;
  createdAt: string;
  updatedAt: string;
};

export const STATUS_LABEL: Record<ProductStatus, string> = {
  available: "ว่าง",
  reserved: "ติดจอง",
  installment: "ติดผ่อน",
  sold: "ขายแล้ว",
};

export const STATUS_ORDER: ProductStatus[] = ["available", "reserved", "installment", "sold"];

export const CATEGORY_LABEL: Record<ProductCategory, string> = {
  recommended: "รวมไอดีแนะนำ",
  rare: "รวมไอดีของเทพแรร์",
  budget: "รวมไอดีงบน้อนราคานักเรียน",
  flag: "รวมไอดีปักธง โหดๆ",
  thousand: "รวมไอดีหลักพันตึงๆ",
  girl: "รวมไอดีเน้นหญิงสวยๆ",
};

export const CATEGORY_ORDER: ProductCategory[] = ["recommended", "rare", "budget", "flag", "thousand", "girl"];

export function formatPrice(price: number): string {
  return price > 0 ? price.toLocaleString("th-TH") + " บาท" : "สอบถามราคา";
}
