"use client";

import { motion } from "framer-motion";

const steps = [
  { icon: "🔎", title: "เลือกรหัสที่สนใจ", desc: "ดูรูปและรายละเอียดในเว็บได้เลย" },
  { icon: "📋", title: "คัดลอกรายละเอียด", desc: "กดปุ่มคัดลอกในหน้ารหัสนั้น" },
  { icon: "💬", title: "ส่งให้แอดมินใน LINE", desc: "แอดมินเช็กของ ยืนยันยอด ส่งช่องทางชำระ" },
  { icon: "✅", title: "รับรหัสทันที", desc: "โอนเสร็จรับรหัสพร้อมยกอีเมลให้ 100%" },
];

export default function HowTo() {
  return (
    <section id="how-to" className="border-y border-line bg-surface/60">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">
          วิธีสั่งซื้อ <span className="text-pink">ง่ายๆ 4 ขั้นตอน</span>
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08 }}
              className="relative rounded-2xl border border-line bg-card p-5"
            >
              <span className="absolute right-4 top-3 font-display text-2xl text-pink/30">{i + 1}</span>
              <span className="text-3xl">{s.icon}</span>
              <p className="mt-3 font-bold">{s.title}</p>
              <p className="mt-1 text-sm text-muted">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
