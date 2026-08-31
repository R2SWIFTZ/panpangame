"use client";

import { motion } from "framer-motion";

const badges = [
  { icon: "⚡", title: "ส่งไวใน 5 นาที", desc: "ชำระเงินปุ๊บ รับไอดีปั๊บ" },
  { icon: "🛡️", title: "ปลอดภัย 100%", desc: "เปลี่ยนรหัส-ผูกอีเมลใหม่ได้เลย" },
  { icon: "💯", title: "รับประกันไอดี", desc: "มีปัญหาแอดมินดูแลทันที" },
  { icon: "💖", title: "ลูกค้า 1,000+", desc: "รีวิวจริงทุกออเดอร์" },
];

export default function TrustBadges() {
  return (
    <section aria-label="จุดเด่นของร้าน" className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {badges.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border-2 border-plum bg-white p-4 sticker-shadow"
          >
            <span className="text-3xl">{b.icon}</span>
            <p className="mt-2 font-bold">{b.title}</p>
            <p className="mt-0.5 text-sm text-plum-soft">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
