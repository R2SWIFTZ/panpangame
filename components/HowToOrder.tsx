"use client";

import { motion } from "framer-motion";

const steps = [
  { icon: "🛒", title: "เลือกไอดีที่ถูกใจ", desc: "กดปุ่ม “ซื้อเลย” ที่การ์ดสินค้า" },
  { icon: "📝", title: "กรอกข้อมูลผู้ซื้อ", desc: "ใส่ชื่อและช่องทางติดต่อกลับ" },
  { icon: "💸", title: "ชำระเงิน", desc: "โอนตามยอดแล้วเก็บสลิปไว้" },
  { icon: "🎁", title: "รับไอดีทันที", desc: "ส่งสลิปทางเพจ รับไอดีใน 5 นาที" },
];

export default function HowToOrder() {
  return (
    <section id="how-to" className="scroll-mt-24 border-y-2 border-plum bg-blush/60 candy-dots">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="text-center">
          <h2 className="font-display text-3xl text-plum sm:text-4xl">
            สั่งซื้อง่ายๆ แค่ <span className="text-hotpink">4 ขั้นตอน</span>
          </h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-3xl border-2 border-plum bg-white p-5 sticker-shadow"
            >
              <span className="absolute -top-4 left-4 grid h-9 w-9 place-items-center rounded-full border-2 border-plum bg-butter font-display text-lg">
                {i + 1}
              </span>
              <span className="text-4xl">{s.icon}</span>
              <p className="mt-3 font-bold">{s.title}</p>
              <p className="mt-1 text-sm text-plum-soft">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
