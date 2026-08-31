export type ProductStatus = "available" | "reserved" | "installment" | "sold";

export type Product = {
  ep: string; // รหัสสินค้า เช่น "EP6431"
  price: number; // 0 = สอบถามราคา
  details: string[];
  images: string[];
  status: ProductStatus;
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

export function formatPrice(price: number): string {
  return price > 0 ? price.toLocaleString("th-TH") + " บาท" : "สอบถามราคา";
}
