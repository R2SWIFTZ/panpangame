"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/lib/config";
import { formatPrice, STATUS_LABEL, type Product } from "@/lib/types";

export default function DetailActions({ product }: { product: Product }) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const sold = product.status === "sold";
  const summary = [
    `สนใจรหัส ${product.ep} ครับ/ค่ะ`,
    `ราคา: ${formatPrice(product.price)}`,
    `สถานะ: ${STATUS_LABEL[product.status]}`,
    ...product.details.map((d) => `- ${d}`),
  ].join("\n");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // เบราว์เซอร์ไม่รองรับ clipboard — ลูกค้าแคปหน้าจอส่งแทนได้
    }
  };

  return (
    <>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          onClick={copy}
          className="rounded-xl border border-line bg-surface py-3.5 font-bold text-ink transition hover:border-pink/50"
        >
          {copied ? "คัดลอกแล้ว ✅" : "📋 คัดลอกรายละเอียด"}
        </button>
        <button
          onClick={() => !sold && setShowModal(true)}
          disabled={sold}
          className={`rounded-xl py-3.5 font-bold text-white transition ${
            sold ? "cursor-not-allowed bg-muted/30 text-muted" : "bg-pink glow-pink hover:bg-pink-strong"
          }`}
        >
          {sold ? "ขายแล้ว" : `สั่งซื้อ / สนใจรหัสนี้ — ${formatPrice(product.price)}`}
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-muted">
        *ลูกค้าสนใจรหัสไหน คัดลอกรายละเอียดหรือแคปภาพส่งใน LINE ได้เลย {siteConfig.lineId}
      </p>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: "spring", damping: 24, stiffness: 300 }}
              role="dialog"
              aria-modal="true"
              aria-label="ติดต่อแอดมินเพื่อสั่งซื้อ"
              className="w-full max-w-sm rounded-3xl border border-pink/30 bg-card p-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-5xl">💬</span>
              <h2 className="mt-3 text-xl font-bold">ติดต่อแอดมินใน LINE เพื่อสั่งซื้อสินค้า</h2>
              <p className="mt-2 text-sm text-muted">
                ส่งรหัส <span className="font-bold text-pink">{product.ep}</span> ให้แอดมินเช็กของ
                ยืนยันยอด และรับช่องทางชำระเงิน
              </p>
              <div className="mt-5 space-y-2.5">
                <button
                  onClick={copy}
                  className="w-full rounded-xl border border-line bg-surface py-3 text-sm font-bold transition hover:border-pink/50"
                >
                  {copied ? "คัดลอกแล้ว ✅" : "📋 คัดลอกรายละเอียดรหัสนี้"}
                </button>
                <a
                  href={siteConfig.lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-xl bg-[#06C755] py-3 font-bold text-white transition hover:brightness-110"
                >
                  เปิด LINE {siteConfig.lineId}
                </a>
              </div>
              <button onClick={() => setShowModal(false)} className="mt-4 text-sm font-semibold text-muted hover:text-ink">
                ปิดหน้าต่าง
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
