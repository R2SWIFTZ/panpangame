"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export default function Gallery({ images, ep }: { images: string[]; ep: string }) {
  const [mode, setMode] = useState<"single" | "grid">("single");
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="grid aspect-video place-items-center rounded-2xl border border-line bg-card text-5xl">🔥</div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-muted">🖼️ อัลบั้ม {images.length} รูป</p>
        <div className="flex gap-2">
          <button
            onClick={() => setMode("single")}
            aria-pressed={mode === "single"}
            className={`rounded-full border px-3 py-1 text-xs font-bold transition ${
              mode === "single" ? "border-pink bg-pink/15 text-pink-soft" : "border-line text-muted hover:text-ink"
            }`}
          >
            แสดงทีละภาพ
          </button>
          <button
            onClick={() => setMode("grid")}
            aria-pressed={mode === "grid"}
            className={`rounded-full border px-3 py-1 text-xs font-bold transition ${
              mode === "grid" ? "border-pink bg-pink/15 text-pink-soft" : "border-line text-muted hover:text-ink"
            }`}
          >
            แสดงหลายภาพ
          </button>
        </div>
      </div>

      {mode === "single" ? (
        <div className="mt-3">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-surface sm:aspect-[4/3]">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <Image
                  src={images[index]}
                  alt={`รูปที่ ${index + 1} ของรหัส ${ep}`}
                  fill
                  sizes="(max-width: 896px) 100vw, 896px"
                  className="object-contain"
                  priority={index === 0}
                />
              </motion.div>
            </AnimatePresence>
            {images.length > 1 && (
              <>
                <button
                  aria-label="รูปก่อนหน้า"
                  onClick={() => setIndex((index - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-2 text-white backdrop-blur-sm transition hover:bg-pink"
                >
                  ‹
                </button>
                <button
                  aria-label="รูปถัดไป"
                  onClick={() => setIndex((index + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-2 text-white backdrop-blur-sm transition hover:bg-pink"
                >
                  ›
                </button>
                <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                  {index + 1}/{images.length}
                </span>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setIndex(i)}
                  aria-label={`ดูรูปที่ ${i + 1}`}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    i === index ? "border-pink" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="" fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => {
                setIndex(i);
                setMode("single");
              }}
              aria-label={`ดูรูปที่ ${i + 1} แบบเต็ม`}
              className="relative aspect-square overflow-hidden rounded-xl border border-line transition hover:border-pink/60"
            >
              <Image src={img} alt={`รูปที่ ${i + 1} ของรหัส ${ep}`} fill sizes="(max-width: 640px) 50vw, 33vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
