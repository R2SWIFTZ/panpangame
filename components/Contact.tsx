"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/config";

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        className="relative overflow-hidden rounded-[2rem] border-2 border-plum bg-gradient-to-br from-pink to-hotpink p-8 text-center text-white sticker-shadow sm:p-12"
      >
        <span aria-hidden className="absolute -left-6 -top-6 text-7xl opacity-30">💬</span>
        <span aria-hidden className="absolute -bottom-6 -right-4 text-7xl opacity-30">🎀</span>
        <h2 className="font-display text-3xl sm:text-4xl">ติดต่อร้าน / สอบถามก่อนซื้อ</h2>
        <p className="mx-auto mt-3 max-w-md text-blush">
          อยากดูรูปไอดีเพิ่ม เช็คสต็อก หรือให้แอดมินช่วยเลือก ทักแชทได้เลย {siteConfig.openHours}
        </p>
        <a
          href={siteConfig.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl border-2 border-plum bg-white px-7 py-3.5 font-bold text-plum transition-transform sticker-shadow hover:-translate-y-0.5"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#1877F2]" aria-hidden>
            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.026 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.93-1.956 1.886v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
          </svg>
          เพจ Facebook: {siteConfig.facebookName}
        </a>
      </motion.div>
    </section>
  );
}
