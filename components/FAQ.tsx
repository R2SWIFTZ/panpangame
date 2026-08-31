"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const faqs = [
  {
    q: "ซื้อไอดีแล้วได้อะไรบ้าง?",
    a: "ได้อีเมล + รหัสผ่านของไอดี พร้อมสิทธิ์เปลี่ยนรหัสและผูกอีเมลใหม่เป็นของคุณเอง 100% ไอดีเป็นของคุณคนเดียว",
  },
  {
    q: "ปลอดภัยไหม? มีประกันหรือเปล่า?",
    a: "ทุกไอดีผ่านการตรวจสอบก่อนขาย และมีประกันหลังการขาย หากมีปัญหาภายในระยะประกัน แอดมินดูแลแก้ไขหรือคืนเงินตามเงื่อนไข",
  },
  {
    q: "โอนเงินแล้วรอนานไหม?",
    a: "หลังส่งสลิปยืนยัน แอดมินจัดส่งไอดีให้ภายใน 5 นาทีในเวลาทำการ (10:00 - 23:00 น.)",
  },
  {
    q: "อยากดูรูปไอดีเพิ่มเติมทำยังไง?",
    a: "ทักแชทเพจ Facebook ของร้าน แจ้งรหัสสินค้า (เช่น FF-001) แอดมินส่งรูปสกิน ชุด และสถิติให้ดูครบก่อนตัดสินใจ",
  },
  {
    q: "มีบริการรับซื้อ/เทิร์นไอดีไหม?",
    a: "มีครับ ทักเพจพร้อมรายละเอียดไอดีของคุณ แอดมินประเมินราคาให้ฟรี",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="border-y-2 border-plum bg-plum scroll-mt-24">
      <div className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="text-center font-display text-3xl text-white sm:text-4xl">
          คำถามที่<span className="text-pink">พบบ่อย</span>
        </h2>
        <div className="mt-8 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="overflow-hidden rounded-2xl border-2 border-white/15 bg-white/5">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-white"
                >
                  {f.q}
                  <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="text-xl text-pink">
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="px-5 pb-4 text-sm leading-relaxed text-blush">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
