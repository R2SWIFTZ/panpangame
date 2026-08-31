"use client";

import { motion } from "framer-motion";

const reviews = [
  { name: "น้องเนย 🧈", text: "ได้ไอดีไวมาก ไม่ถึง 5 นาที สกินครบตามรูปเลยค่ะ แอดมินใจดีสุดๆ", item: "FF-002" },
  { name: "บอมบ์ 💣", text: "ซื้อครั้งที่ 3 แล้วครับ เชื่อถือได้ เปลี่ยนรหัสผูกเมลใหม่ได้หมด", item: "FF-001" },
  { name: "มายด์มิ้นต์ 🍃", text: "ราคาถูกกว่าร้านอื่นเยอะ ไอดีสวยจริง แนะนำเลยค่า", item: "FF-006" },
  { name: "กัปตัน ⚓", text: "ตอนแรกกลัวโดนโกง แต่ร้านนี้ของจริง มีประกันด้วย ประทับใจครับ", item: "FF-004" },
  { name: "พลอยใส ✨", text: "แอดมินตอบไวมากก ถามรูปเพิ่มก็ส่งให้ดูหมดเลย น่ารักสุด", item: "FF-003" },
  { name: "เจมส์ 🎯", text: "ไอดีเทพจริง แรงค์ฮีโร่พร้อมดันต่อ คุ้มมากครับ", item: "FF-009" },
];

export default function Reviews() {
  return (
    <section id="reviews" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14">
      <div className="text-center">
        <p className="inline-block rotate-[-1.5deg] rounded-full border-2 border-plum bg-butter px-4 py-1 text-sm font-bold sticker-shadow">
          ⭐⭐⭐⭐⭐ 4.9/5 จากลูกค้าจริง
        </p>
        <h2 className="mt-3 font-display text-3xl text-plum sm:text-4xl">
          รีวิวจาก<span className="text-hotpink">ลูกค้าตัวจริง</span>
        </h2>
      </div>
      <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {reviews.map((r, i) => (
          <motion.figure
            key={r.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: (i % 3) * 0.1 }}
            className="mb-5 break-inside-avoid rounded-3xl border-2 border-plum bg-white p-5 sticker-shadow"
          >
            <div aria-hidden className="text-butter">★★★★★</div>
            <blockquote className="mt-2 text-sm leading-relaxed text-plum">“{r.text}”</blockquote>
            <figcaption className="mt-3 flex items-center justify-between text-sm">
              <span className="font-bold">{r.name}</span>
              <span className="rounded-full bg-blush px-2.5 py-0.5 text-xs font-semibold text-hotpink">ซื้อ {r.item}</span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
