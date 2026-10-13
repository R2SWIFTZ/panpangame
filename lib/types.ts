export type ProductStatus = "available" | "reserved" | "installment" | "sold";

export type ProductCategory = "recommended" | "rare" | "budget" | "flag" | "thousand" | "girl" | "prime8";

export type Product = {
  ep: string; // รหัสสินค้า เช่น "EP6431"
  price: number; // 0 = สอบถามราคา
  installmentPrice: number; // ราคาเปิดผ่อนเล่น — 0 = ไม่แสดง
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
  prime8: "ไอดี Prime 8",
};

export const CATEGORY_ORDER: ProductCategory[] = ["recommended", "rare", "budget", "flag", "thousand", "girl", "prime8"];

export function formatPrice(price: number): string {
  return price > 0 ? price.toLocaleString("th-TH") + " บาท" : "สอบถามราคา";
}

export const INSTALLMENT_LABEL = "ราคาเปิดผ่อนเล่น";

// Optional second price. Shown only when set (> 0), so 0 is "not offered".
export function formatInstallmentPrice(price: number): string {
  return price.toLocaleString("th-TH") + " บาท";
}
