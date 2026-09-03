"use client";

import Image from "next/image";
import { Reorder, useDragControls } from "framer-motion";
import { CATEGORY_LABEL, formatPrice, STATUS_LABEL, STATUS_ORDER, type Product, type ProductStatus } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";

type Props = {
  product: Product;
  busy: boolean;
  onStatus: (status: ProductStatus) => void;
  onEdit: () => void;
  onRemove: () => void;
  onDropped: () => void;
};

export default function ProductRow({ product: p, busy, onStatus, onEdit, onRemove, onDropped }: Props) {
  // Drag only from the grip, not the whole card — otherwise a scroll-swipe on
  // a phone would start a reorder and the select/buttons would fight it.
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={p}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onDropped}
      className="list-none rounded-2xl border border-line bg-card p-3 sm:p-4"
      whileDrag={{ scale: 1.02, boxShadow: "0 12px 32px rgba(255, 77, 157, 0.25)" }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            aria-label={`ลากเพื่อย้ายลำดับ ${p.ep}`}
            onPointerDown={(e) => controls.start(e)}
            className="grid h-11 w-8 shrink-0 cursor-grab touch-none place-items-center rounded-lg text-muted transition hover:bg-surface hover:text-ink active:cursor-grabbing"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface sm:h-16 sm:w-16">
            {p.images[0] ? (
              <Image src={p.images[0]} alt="" fill sizes="80px" className="object-cover" />
            ) : (
              <div className="grid h-full place-items-center text-2xl">🔥</div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-base font-bold tracking-wide">{p.ep}</p>
              <StatusBadge status={p.status} />
            </div>
            <p className="mt-1 text-sm text-ink/90">
              <span className={`font-semibold ${p.price > 0 ? "text-pink" : "text-pink-soft"}`}>{formatPrice(p.price)}</span>
              <span className="text-muted"> · </span>
              <span className="inline-block text-muted">{CATEGORY_LABEL[p.category]}</span>
            </p>
            <p className="text-xs text-muted">
              {p.images.length} รูป · {p.details.length} รายละเอียด
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_auto] gap-2 sm:flex sm:shrink-0">
          <select
            value={p.status}
            disabled={busy}
            onChange={(e) => onStatus(e.target.value as ProductStatus)}
            aria-label={`เปลี่ยนสถานะ ${p.ep}`}
            className="h-11 rounded-xl border border-line bg-surface px-3 text-sm font-semibold outline-none focus:border-pink disabled:opacity-50"
          >
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onEdit}
            className="h-11 rounded-xl border border-line bg-surface px-4 text-sm font-semibold transition hover:border-pink/50"
          >
            แก้ไข
          </button>
          <button
            type="button"
            onClick={onRemove}
            disabled={busy}
            className="h-11 rounded-xl border border-line bg-surface px-4 text-sm font-semibold text-rose transition hover:border-rose/50 disabled:opacity-50"
          >
            ลบ
          </button>
        </div>
      </div>
    </Reorder.Item>
  );
}
