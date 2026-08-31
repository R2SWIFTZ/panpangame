"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import generatePayload from "promptpay-qr";
import { siteConfig } from "@/lib/config";
import { formatPrice, type Product } from "@/lib/products";

type Step = "info" | "pay" | "done";

export default function CheckoutModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("info");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [copied, setCopied] = useState(false);

  const orderId = useMemo(
    () => (product ? `PPG-${product.code}-${Date.now().toString().slice(-5)}` : ""),
    [product]
  );

  const qrPayload = useMemo(() => {
    if (!product || !siteConfig.promptpayId) return null;
    try {
      return generatePayload(siteConfig.promptpayId, { amount: product.price });
    } catch {
      return null;
    }
  }, [product]);

  if (!product) return null;

  const orderText = [
    `🛒 สั่งซื้อไอดีจากเว็บ ${siteConfig.name}`,
    `เลขออเดอร์: ${orderId}`,
    `สินค้า: ${product.code} — ${product.title}`,
    `ราคา: ${formatPrice(product.price)}`,
    `ชื่อผู้ซื้อ: ${name}`,
    `ช่องทางติดต่อกลับ: ${contact}`,
  ].join("\n");

  const copyOrder = async () => {
    try {
      await navigator.clipboard.writeText(orderText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // เบราว์เซอร์เก่าไม่รองรับ clipboard — ลูกค้าพิมพ์ข้อมูลเองได้จากหน้าจอ
    }
  };

  const close = () => {
    setStep("info");
    setName("");
    setContact("");
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 grid place-items-center bg-plum/60 p-4 backdrop-blur-sm"
        onClick={close}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: "spring", damping: 24, stiffness: 300 }}
          role="dialog"
          aria-modal="true"
          aria-label={`สั่งซื้อ ${product.title}`}
          className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border-2 border-plum bg-white p-6 sticker-shadow-pink"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-pink">ขั้นตอน {step === "info" ? "1" : step === "pay" ? "2" : "3"}/3</p>
              <h2 className="font-display text-xl text-plum">
                {step === "info" && "ข้อมูลผู้ซื้อ"}
                {step === "pay" && "ชำระเงิน"}
                {step === "done" && "ส่งออเดอร์ให้ร้าน 🎉"}
              </h2>
            </div>
            <button onClick={close} aria-label="ปิด" className="rounded-full bg-blush px-3 py-1 font-bold text-hotpink">
              ✕
            </button>
          </div>

          {/* สรุปสินค้า */}
          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-cream p-3">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-pink to-hotpink text-2xl">
              🔥
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{product.code} — {product.title}</p>
              <p className="font-display text-lg text-hotpink">{formatPrice(product.price)}</p>
            </div>
          </div>

          {step === "info" && (
            <form
              className="mt-5 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (name.trim() && contact.trim()) setStep("pay");
              }}
            >
              <label className="block">
                <span className="text-sm font-semibold">ชื่อผู้ซื้อ / ชื่อเล่น</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={60}
                  placeholder="เช่น น้องปันปัน"
                  className="mt-1 w-full rounded-xl border-2 border-plum/20 bg-cream px-4 py-2.5 outline-none transition focus:border-pink"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">ช่องทางติดต่อกลับ (ชื่อเฟส / ไลน์ / เบอร์)</span>
                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                  maxLength={100}
                  placeholder="เช่น Facebook: Panpan Cha"
                  className="mt-1 w-full rounded-xl border-2 border-plum/20 bg-cream px-4 py-2.5 outline-none transition focus:border-pink"
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-2xl border-2 border-plum bg-pink py-3 font-bold text-white sticker-shadow transition-transform hover:-translate-y-0.5"
              >
                ไปหน้าชำระเงิน →
              </button>
            </form>
          )}

          {step === "pay" && (
            <div className="mt-5 space-y-4">
              {qrPayload ? (
                <div className="rounded-2xl border-2 border-plum/15 bg-cream p-4 text-center">
                  <p className="font-bold">สแกนจ่ายผ่านพร้อมเพย์ 📱</p>
                  <div className="mx-auto mt-3 w-fit rounded-xl bg-white p-3">
                    <QRCodeSVG value={qrPayload} size={180} />
                  </div>
                  <p className="mt-2 text-sm text-plum-soft">
                    ยอดชำระ <span className="font-bold text-hotpink">{formatPrice(product.price)}</span>
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-plum/15 bg-cream p-4">
                  <p className="font-bold">ขั้นตอนการชำระเงิน 💸</p>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-plum-soft">
                    <li>กดปุ่มด้านล่างเพื่อไปขั้นตอนส่งออเดอร์</li>
                    <li>ส่งข้อมูลออเดอร์ให้แอดมินทางเพจ Facebook</li>
                    <li>แอดมินส่งช่องทางโอน (พร้อมเพย์/ธนาคาร) ให้ทันที</li>
                    <li>โอนเสร็จส่งสลิป รับไอดีภายใน 5 นาที ⚡</li>
                  </ol>
                </div>
              )}
              <button
                onClick={() => setStep("done")}
                className="w-full rounded-2xl border-2 border-plum bg-pink py-3 font-bold text-white sticker-shadow transition-transform hover:-translate-y-0.5"
              >
                {qrPayload ? "โอนแล้ว ไปแจ้งสลิป →" : "ไปส่งออเดอร์ให้ร้าน →"}
              </button>
              <button onClick={() => setStep("info")} className="w-full text-sm font-semibold text-plum-soft">
                ← กลับไปแก้ข้อมูล
              </button>
            </div>
          )}

          {step === "done" && (
            <div className="mt-5 space-y-4">
              <pre className="whitespace-pre-wrap rounded-2xl bg-plum p-4 text-sm text-blush">{orderText}</pre>
              <button
                onClick={copyOrder}
                className="w-full rounded-2xl border-2 border-plum bg-butter py-3 font-bold text-plum sticker-shadow transition-transform hover:-translate-y-0.5"
              >
                {copied ? "คัดลอกแล้ว ✅" : "คัดลอกข้อมูลออเดอร์ 📋"}
              </button>
              <a
                href={siteConfig.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-2xl border-2 border-plum bg-pink py-3 text-center font-bold text-white sticker-shadow transition-transform hover:-translate-y-0.5"
              >
                ส่งออเดอร์ + สลิปทางเพจ Facebook 💬
              </a>
              <p className="text-center text-xs text-plum-soft">
                วางข้อความที่คัดลอกในแชทเพจ แอดมินจะดูแลต่อทันที {siteConfig.openHours}
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
