// เติมข้อมูลเริ่มต้น: อัปโหลดรูปจากโฟลเดอร์และสร้าง data/products.json
// ใช้: node --env-file=.env.local scripts/seed.mjs <dir-ep6431> <dir-ep71>
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { put } from "@vercel/blob";

const [dir6431, dir71] = process.argv.slice(2);
if (!dir6431 || !dir71) {
  console.error("usage: node --env-file=.env.local scripts/seed.mjs <dir-ep6431> <dir-ep71>");
  process.exit(1);
}

async function uploadDir(dir, ep) {
  const files = (await readdir(dir)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
  const urls = [];
  for (const f of files) {
    const body = await readFile(join(dir, f));
    const blob = await put(`ids/${ep}/${f}`, body, {
      access: "public",
      addRandomSuffix: true,
      contentType: f.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg",
    });
    urls.push(blob.url);
    console.log(`  ${ep}: ${f} -> uploaded`);
  }
  return urls;
}

const now = new Date().toISOString();
const images6431 = await uploadDir(dir6431, "EP6431");
const images71 = await uploadDir(dir71, "EP71");

const products = [
  {
    ep: "EP6431",
    price: 0,
    details: [
      "เลเวล 73",
      "ปืนวิวัฒน์ Lv.7 หลายกระบอก",
      "สกินปืนหายากเพียบ",
      "ชุดแฟชั่นหลายชุด",
      "ยกรหัสให้ทั้งอีเมล เปลี่ยนเป็นของผู้ซื้อ 100%",
    ],
    images: images6431,
    status: "available",
    createdAt: now,
    updatedAt: now,
  },
  {
    ep: "EP71",
    price: 0,
    details: [
      "ไอเทมรวม 605 ชิ้น",
      "สั่งประดิษฐ์ 8",
      "ตัวละคร-ท่าเต้นเยอะ",
      "สกินปืน-ชุดแฟชั่นจัดเต็ม",
      "ยกรหัสให้ทั้งอีเมล เปลี่ยนเป็นของผู้ซื้อ 100%",
    ],
    images: images71,
    status: "available",
    createdAt: now,
    updatedAt: now,
  },
];

await put("data/products.json", JSON.stringify(products), {
  access: "public",
  contentType: "application/json",
  allowOverwrite: true,
  addRandomSuffix: false,
  cacheControlMaxAge: 60,
});
console.log(`seeded ${products.length} products, ${images6431.length + images71.length} images`);
