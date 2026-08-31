"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { categories, products, type Product, type ProductCategory } from "@/lib/products";
import ProductCard from "./ProductCard";
import CheckoutModal from "./CheckoutModal";

export default function ProductGrid() {
  const [active, setActive] = useState<ProductCategory | "all">("all");
  const [buying, setBuying] = useState<Product | null>(null);

  const shown = active === "all" ? products : products.filter((p) => p.category === active);

  return (
    <section id="products" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12">
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block rotate-[1.5deg] rounded-full border-2 border-plum bg-blush px-4 py-1 text-sm font-bold text-hotpink sticker-shadow"
        >
          🛍️ สินค้าทั้งหมด
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-3 font-display text-3xl text-plum sm:text-4xl"
        >
          เลือกไอดี <span className="text-hotpink">Free Fire</span> ที่ใช่สำหรับคุณ
        </motion.h2>
        <p className="mt-2 text-plum-soft">กดซื้อแล้วชำระเงินบนเว็บได้เลย รับไอดีไวสุดใน 5 นาที</p>
      </div>

      <div role="tablist" aria-label="หมวดหมู่สินค้า" className="mt-8 flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={active === c.id}
            onClick={() => setActive(c.id)}
            className={`rounded-full border-2 px-4 py-2 text-sm font-bold transition ${
              active === c.id
                ? "border-plum bg-plum text-white sticker-shadow-pink"
                : "border-plum/20 bg-white text-plum-soft hover:border-pink hover:text-hotpink"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <motion.div layout className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p) => (
            <ProductCard key={p.code} product={p} onBuy={setBuying} />
          ))}
        </AnimatePresence>
      </motion.div>

      <p className="mt-8 text-center text-sm text-plum-soft">
        📸 อยากดูรูปจริง/สอบถามรายละเอียดไอดี ทักแชทเพจได้เลย มีไอดีใหม่เข้าทุกวัน
      </p>

      {buying && <CheckoutModal product={buying} onClose={() => setBuying(null)} />}
    </section>
  );
}
