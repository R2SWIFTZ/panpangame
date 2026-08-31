"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/config";

const float = (delay: number) => ({
  initial: { y: 0 },
  animate: { y: [0, -14, 0] },
  transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const, delay },
});

const marqueeItems = [
  "🔥 ไอดีฟีฟายแท้ 100%",
  "⚡ ส่งไวใน 5 นาที",
  "🛡️ รับประกันหลังการขาย",
  "💎 ราคาดีที่สุด",
  "⭐ รีวิวจริงจากลูกค้า",
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden candy-dots">
      {/* วงกลมตกแต่งพื้นหลัง */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blush blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-20 top-40 h-64 w-64 rounded-full bg-pink/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-14 md:grid-cols-[1.2fr_1fr] md:items-center md:pt-20">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex rotate-[-2deg] items-center gap-2 rounded-full border-2 border-plum bg-butter px-4 py-1.5 text-sm font-bold sticker-shadow"
          >
            🐰 ร้านไอดี Free Fire เจ้าเดิมที่วางใจได้
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-5 font-display text-4xl leading-tight text-plum sm:text-5xl lg:text-6xl"
          >
            ไอดี <span className="text-hotpink">ฟีฟาย</span> เทพๆ
            <br />
            ราคาน่ารัก <span className="relative inline-block">
              ส่งไว
              <svg aria-hidden viewBox="0 0 120 12" className="absolute -bottom-1 left-0 w-full text-pink">
                <path d="M2 9 Q 30 2 60 7 T 118 5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-5 max-w-md text-base text-plum-soft sm:text-lg"
          >
            เลือกไอดีที่ถูกใจ ชำระเงินบนเว็บได้เลย รับไอดีไวภายใน 5 นาที
            มีแอดมินดูแลทุกออเดอร์ {siteConfig.openHours}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <a
              href="#products"
              className="rounded-2xl border-2 border-plum bg-pink px-7 py-3.5 text-lg font-bold text-white transition-transform sticker-shadow hover:-translate-y-0.5"
            >
              เลือกซื้อไอดีเลย 🛒
            </a>
            <a
              href="#how-to"
              className="rounded-2xl border-2 border-plum bg-white px-6 py-3.5 text-lg font-semibold text-plum transition-transform sticker-shadow hover:-translate-y-0.5"
            >
              ดูวิธีสั่งซื้อ
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-plum-soft"
          >
            <span>✅ ขายมาแล้ว 1,000+ ไอดี</span>
            <span>✅ การันตีคืนเงินหากมีปัญหา</span>
          </motion.div>
        </div>

        {/* การ์ดโชว์ฝั่งขวา */}
        <div className="relative mx-auto w-full max-w-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
            animate={{ opacity: 1, scale: 1, rotate: 3 }}
            transition={{ delay: 0.35, type: "spring" }}
            className="rounded-3xl border-2 border-plum bg-white p-5 sticker-shadow-pink"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-mint/15 px-3 py-1 text-xs font-bold text-mint">● พร้อมส่งทันที</span>
              <span className="text-xs font-semibold text-plum-soft">FF-001</span>
            </div>
            <div className="mt-4 grid h-40 place-items-center rounded-2xl bg-gradient-to-br from-pink via-hotpink to-plum text-6xl">
              🔥
            </div>
            <p className="mt-4 font-display text-lg text-plum">ไอดีเทพ ครบทุกอย่าง</p>
            <p className="mt-1 text-sm text-plum-soft">แรงค์ฮีโร่ · สกินปืนหายาก · ตัวละครครบ</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-2xl text-hotpink">4,990฿</span>
              <span className="text-sm text-plum-soft line-through">5,990฿</span>
            </div>
          </motion.div>
          <motion.span {...float(0)} aria-hidden className="absolute -left-8 -top-6 text-4xl">💎</motion.span>
          <motion.span {...float(1.2)} aria-hidden className="absolute -right-4 top-10 text-4xl">🎀</motion.span>
          <motion.span {...float(0.6)} aria-hidden className="absolute -bottom-6 left-8 text-4xl">⭐</motion.span>
        </div>
      </div>

      {/* แถบตัววิ่ง */}
      <div className="overflow-hidden border-y-2 border-plum bg-plum py-2.5">
        <div className="flex w-max animate-marquee gap-8">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((t, i) => (
            <span key={i} className="whitespace-nowrap text-sm font-semibold text-blush">
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
