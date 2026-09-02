"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/config";

export default function HomeHero({ availableCount }: { availableCount: number }) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-grid">
      <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-pink/15 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4 py-11 text-center sm:py-18">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-pink/30 bg-pink/10 px-4 py-1.5 text-sm font-semibold text-pink-soft"
        >
          🔥 รหัสว่างพร้อมขาย {availableCount} รหัส
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-5 max-w-2xl font-display text-[2rem] leading-[1.15] tracking-tight text-balance sm:text-5xl"
        >
          <span className="whitespace-nowrap">
            รหัส <span className="text-pink">Free Fire</span>
          </span>{" "}
          <span className="whitespace-nowrap">คัดคุณภาพ</span>
          <br className="hidden sm:block" />{" "}
          <span className="whitespace-nowrap">ส่งไว ปลอดภัย</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-4 max-w-lg text-muted"
        >
          กดดูรหัสที่สนใจ คัดลอกรายละเอียด แล้วทักแอดมินใน LINE ได้เลย {siteConfig.openHours}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <a
            href="#products"
            className="rounded-xl bg-pink px-7 py-3 font-bold text-white transition glow-pink hover:bg-pink-strong"
          >
            ดูรหัสทั้งหมด
          </a>
          <a
            href={siteConfig.lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-line bg-surface px-6 py-3 font-semibold text-ink transition hover:border-pink/40"
          >
            ทัก LINE สอบถาม
          </a>
        </motion.div>
      </div>
    </section>
  );
}
