"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/config";

export default function ContactSection() {
  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        className="overflow-hidden rounded-3xl border border-pink/25 bg-gradient-to-br from-card to-pink/10 p-8 text-center sm:p-12"
      >
        <h2 className="text-2xl font-bold sm:text-3xl">
          ติดต่อร้าน / <span className="whitespace-nowrap text-pink">สอบถามก่อนซื้อ</span>
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted">
          เช็กสถานะรหัส ขอรูปเพิ่ม หรือให้แอดมินช่วยเลือก ทักได้เลย {siteConfig.openHours}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a
            href={siteConfig.lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-[#06C755] px-7 py-3 font-bold text-white transition hover:brightness-110"
          >
            💬 LINE {siteConfig.lineId}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
