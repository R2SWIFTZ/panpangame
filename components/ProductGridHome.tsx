"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { CATEGORY_LABEL, CATEGORY_ORDER, formatPrice, type Product, type ProductCategory } from "@/lib/types";
import StatusBadge from "./StatusBadge";

type Filter = ProductCategory | "all";

export default function ProductGridHome({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const shown = filter === "all" ? products : products.filter((p) => p.category === filter);

  return (
    <section id="products" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">
            รหัสทั้งหมด <span className="text-pink">({products.length})</span>
          </h2>
          <p className="mt-1 text-sm text-muted">กดที่รหัสเพื่อดูรูปและรายละเอียดทั้งหมด</p>
        </div>
        <div role="tablist" aria-label="กรองตามหมวด" className="flex flex-wrap gap-2">
          {(["all", ...CATEGORY_ORDER] as Filter[]).map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={filter === s}
              onClick={() => setFilter(s)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
                filter === s
                  ? "border-pink bg-pink/15 text-pink-soft"
                  : "border-line bg-surface text-muted hover:border-pink/40 hover:text-ink"
              }`}
            >
              {s === "all" ? "ทั้งหมด" : CATEGORY_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="mt-14 text-center text-muted">ยังไม่มีรหัสในหมวดนี้ — ทัก LINE สอบถามได้เลย</p>
      ) : (
        <motion.div layout className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {shown.map((p) => {
              const sold = p.status === "sold";
              return (
                <motion.div
                  key={p.ep}
                  layout
                  className="min-w-0"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Link
                    href={`/id/${encodeURIComponent(p.ep)}`}
                    className={`group block overflow-hidden rounded-2xl border border-line bg-card transition hover:border-pink/50 hover:glow-pink ${
                      sold ? "opacity-60" : ""
                    }`}
                  >
                    <div className="relative aspect-square overflow-hidden bg-surface">
                      {p.images[0] ? (
                        <Image
                          src={p.images[0]}
                          alt={`รูปตัวอย่างรหัส ${p.ep}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className={`object-cover transition duration-300 group-hover:scale-105 ${sold ? "grayscale" : ""}`}
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-5xl">🔥</div>
                      )}
                      <StatusBadge status={p.status} className="absolute left-3 top-3 backdrop-blur-sm" />
                      {p.images.length > 1 && (
                        <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                          🖼️ {p.images.length} รูป
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-3 p-4">
                      <div className="min-w-0">
                        <p className="text-lg font-bold tracking-wide">{p.ep}</p>
                        <p className="truncate text-sm text-muted">{p.details[0] ?? "ดูรายละเอียดด้านใน"}</p>
                      </div>
                      <p className={`shrink-0 text-lg font-bold ${p.price > 0 ? "text-pink" : "text-pink-soft"}`}>
                        {formatPrice(p.price)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
