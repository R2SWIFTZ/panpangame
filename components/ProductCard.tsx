"use client";

import { motion } from "framer-motion";
import { formatPrice, type Product } from "@/lib/products";

const rankColor: Record<string, string> = {
  "ฮีโร่": "bg-butter text-plum",
  "แกรนด์มาสเตอร์": "bg-hotpink text-white",
  "มาสเตอร์": "bg-pink text-white",
  "เพชร": "bg-blush text-hotpink",
  "ทอง": "bg-butter/60 text-plum",
  "เงิน": "bg-plum/10 text-plum-soft",
};

export default function ProductCard({
  product,
  onBuy,
}: {
  product: Product;
  onBuy: (p: Product) => void;
}) {
  const soldOut = product.sold;
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      whileHover={soldOut ? undefined : { y: -6, rotate: -0.5 }}
      className={`relative flex flex-col overflow-hidden rounded-3xl border-2 border-plum bg-white sticker-shadow ${
        soldOut ? "opacity-70" : ""
      }`}
    >
      {product.hot && !soldOut && (
        <span className="absolute left-3 top-3 z-10 rotate-[-4deg] rounded-full border-2 border-plum bg-butter px-3 py-0.5 text-xs font-bold">
          🔥 ขายดี
        </span>
      )}
      <div className="relative grid h-40 place-items-center bg-gradient-to-br from-blush via-pink/50 to-hotpink/60">
        <span className="text-6xl drop-shadow-lg">{soldOut ? "😿" : "🔥"}</span>
        <span className="absolute bottom-2 right-3 rounded-full bg-plum/80 px-2.5 py-0.5 text-xs font-semibold text-white">
          {product.code}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${rankColor[product.rank] ?? "bg-blush text-hotpink"}`}>
            แรงค์{product.rank}
          </span>
          <span className="text-xs font-medium text-plum-soft">เลเวล {product.level}</span>
        </div>
        <h3 className="mt-2 font-bold leading-snug">{product.title}</h3>
        <ul className="mt-2 space-y-1 text-sm text-plum-soft">
          {product.highlights.slice(0, 3).map((h) => (
            <li key={h}>✦ {h}</li>
          ))}
        </ul>
        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            {product.oldPrice && (
              <p className="text-xs text-plum-soft line-through">{formatPrice(product.oldPrice)}</p>
            )}
            <p className="font-display text-2xl text-hotpink">{formatPrice(product.price)}</p>
          </div>
          {soldOut ? (
            <span className="rounded-xl bg-plum/10 px-4 py-2 text-sm font-bold text-plum-soft">ขายแล้ว</span>
          ) : (
            <button
              onClick={() => onBuy(product)}
              className="rounded-xl border-2 border-plum bg-pink px-4 py-2 text-sm font-bold text-white transition-transform sticker-shadow hover:-translate-y-0.5 active:translate-y-0"
            >
              ซื้อเลย
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
