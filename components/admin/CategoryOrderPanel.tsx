"use client";

import { useEffect, useRef, useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { CATEGORY_LABEL, type ProductCategory } from "@/lib/types";

// Drag-to-reorder for the public filter chips. Same grip pattern as the
// product rows: one vertical list, drag from the ≡ only, persist on release.
// "ทั้งหมด" is not a category — it is always rendered first on the site.
export default function CategoryOrderPanel({ initialOrder }: { initialOrder: ProductCategory[] }) {
  const [order, setOrder] = useState(initialOrder);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const orderRef = useRef(order);
  useEffect(() => {
    orderRef.current = order;
  }, [order]);

  const persist = async () => {
    setError("");
    setSaved(false);
    const res = await fetch("/api/admin/categories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: orderRef.current }),
    });
    if (res.ok) {
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1800);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "บันทึกลำดับหมวดไม่สำเร็จ");
    }
  };

  return (
    <section aria-labelledby="cat-order-heading" className="mt-8 rounded-2xl border border-line bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 id="cat-order-heading" className="font-bold">
            ลำดับปุ่มหมวดบนหน้าเว็บ
          </h2>
          <p className="mt-0.5 text-xs text-muted">ลากที่ขีดสามขีดเพื่อสลับ — &ldquo;ทั้งหมด&rdquo; อยู่หน้าสุดเสมอ</p>
        </div>
        <p aria-live="polite" className="text-xs font-semibold text-mint">
          {saved ? "บันทึกแล้ว ✓" : ""}
        </p>
      </div>
      {error && <p className="mt-3 rounded-xl border border-rose/40 bg-rose/10 px-3 py-2 text-sm font-semibold text-rose">{error}</p>}

      <Reorder.Group axis="y" values={order} onReorder={setOrder} className="mt-3 space-y-2">
        {order.map((c, i) => (
          <CategoryRow key={c} category={c} index={i} onDropped={persist} />
        ))}
      </Reorder.Group>
    </section>
  );
}

function CategoryRow({ category, index, onDropped }: { category: ProductCategory; index: number; onDropped: () => void }) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={category}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onDropped}
      whileDrag={{ scale: 1.02, boxShadow: "0 10px 28px rgba(255, 77, 157, 0.25)" }}
      className="flex list-none items-center gap-2 rounded-xl border border-line bg-surface py-1 pl-1 pr-3"
    >
      <button
        type="button"
        aria-label={`ลากเพื่อย้ายลำดับหมวด ${CATEGORY_LABEL[category]}`}
        onPointerDown={(e) => controls.start(e)}
        className="grid h-11 w-8 shrink-0 cursor-grab touch-none place-items-center rounded-lg text-muted transition hover:bg-card hover:text-ink active:cursor-grabbing"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <span className="w-5 shrink-0 text-center text-xs font-bold tabular-nums text-pink">{index + 1}</span>
      <span className="rounded-full border border-line bg-card px-3 py-1 text-sm font-semibold">{CATEGORY_LABEL[category]}</span>
    </Reorder.Item>
  );
}
