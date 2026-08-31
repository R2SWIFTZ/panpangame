export type ProductCategory = "god" | "gun-skin" | "costume" | "budget";

export type Product = {
  code: string;
  title: string;
  category: ProductCategory;
  rank: string;
  level: number;
  highlights: string[];
  price: number;
  oldPrice?: number;
  sold?: boolean;
  hot?: boolean;
};

export const categories: { id: ProductCategory | "all"; label: string }[] = [
  { id: "all", label: "ทั้งหมด" },
  { id: "god", label: "🔥 ไอดีเทพ" },
  { id: "gun-skin", label: "🔫 เน้นสกินปืน" },
  { id: "costume", label: "👗 เน้นชุด" },
  { id: "budget", label: "💸 ราคาประหยัด" },
];

// ตัวอย่างสินค้า — แก้ไข/เพิ่มรายการไอดีจริงของร้านได้ที่ไฟล์นี้
export const products: Product[] = [
  {
    code: "FF-001",
    title: "ไอดีเทพ ครบทุกอย่าง สกินปืนหายาก",
    category: "god",
    rank: "ฮีโร่",
    level: 72,
    highlights: ["MP40 มังกรพิโรธ", "AK เทพอสูร", "ชุดกระต่ายดำ", "ตัวละครครบ", "เพชรเหลือ 1,200"],
    price: 4990,
    oldPrice: 5990,
    hot: true,
  },
  {
    code: "FF-002",
    title: "ไอดีเน้นสกินปืน แรงค์สูง",
    category: "gun-skin",
    rank: "แกรนด์มาสเตอร์",
    level: 68,
    highlights: ["Scar ไทเทเนียม", "M1887 เมกา", "สกินปืนรวม 40+ ชิ้น"],
    price: 2590,
    oldPrice: 2990,
    hot: true,
  },
  {
    code: "FF-003",
    title: "ไอดีชุดหายาก สายแฟชั่น",
    category: "costume",
    rank: "เพชร",
    level: 61,
    highlights: ["ชุดกระต่ายชมพู", "ชุดแมวดำ", "แม็กเน็ตครบเซ็ต", "ชุดรวม 30+ ชุด"],
    price: 1690,
  },
  {
    code: "FF-004",
    title: "ไอดีตัวละครครบ พร้อมเพชร",
    category: "god",
    rank: "ฮีโร่",
    level: 70,
    highlights: ["ตัวละครครบทุกตัว", "เพชรเหลือ 2,000", "สกินรถหายาก"],
    price: 3490,
  },
  {
    code: "FF-005",
    title: "ไอดีสกิน MP40 ล้วน สายซุ่ม",
    category: "gun-skin",
    rank: "มาสเตอร์",
    level: 65,
    highlights: ["MP40 ครบทุกซีซั่น", "แรงค์พร้อมดัน", "ผูกอีเมลเปล่า"],
    price: 1890,
    oldPrice: 2290,
  },
  {
    code: "FF-006",
    title: "ไอดีเริ่มต้น สายประหยัด",
    category: "budget",
    rank: "ทอง",
    level: 45,
    highlights: ["สกินปืน 10+ ชิ้น", "ชุดสวย 5 ชุด", "เหมาะมือใหม่"],
    price: 390,
  },
  {
    code: "FF-007",
    title: "ไอดีถูกสุดในร้าน",
    category: "budget",
    rank: "เงิน",
    level: 38,
    highlights: ["ตัวละคร 8 ตัว", "พร้อมเปลี่ยนรหัสได้เลย"],
    price: 259,
  },
  {
    code: "FF-008",
    title: "ไอดีชุดนางฟ้า + สกินปืนสวย",
    category: "costume",
    rank: "เพชร",
    level: 58,
    highlights: ["ชุดนางฟ้าครบเซ็ต", "UMP วาเลนไทน์", "เพชรเหลือ 500"],
    price: 1290,
    sold: true,
  },
  {
    code: "FF-009",
    title: "ไอดีเทพ สายโชว์ แรงค์ฮีโร่",
    category: "god",
    rank: "ฮีโร่",
    level: 74,
    highlights: ["สกินภาคพิเศษครบ", "เสื้อกิลด์หายาก", "สถิติสวย K/D 4.2"],
    price: 5990,
    hot: true,
  },
];

export const formatPrice = (n: number) => n.toLocaleString("th-TH") + "฿";
