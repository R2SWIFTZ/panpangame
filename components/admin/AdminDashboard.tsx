"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Reorder } from "framer-motion";
import { CATEGORY_LABEL, type Product, type ProductCategory, type ProductStatus } from "@/lib/types";
import CategoryChips, { type CategoryFilter } from "@/components/CategoryChips";
import ProductForm from "./ProductForm";
import ProductRow from "./ProductRow";
import CategoryOrderPanel from "./CategoryOrderPanel";

export default function AdminDashboard({
  initialProducts,
  initialCategoryOrder,
}: {
  initialProducts: Product[];
  initialCategoryOrder: ProductCategory[];
}) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  // Chip order is shared with the storefront. It lives here (not in the
  // order panel) so the filter chips above the list follow a drag right away.
  const [categoryOrder, setCategoryOrder] = useState(initialCategoryOrder);
  // Same chips as the public grid: "ทั้งหมด" or one category at a time.
  const [filter, setFilter] = useState<CategoryFilter>("all");
  // Latest order for the drag-end handler — Reorder fires onReorder on every
  // hover-swap, but we only persist once the grip is released.
  const orderRef = useRef(products);
  useEffect(() => {
    orderRef.current = products;
  }, [products]);
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [busyEp, setBusyEp] = useState<string | null>(null);
  const [error, setError] = useState("");

  const shown = filter === "all" ? products : products.filter((p) => p.category === filter);

  // Dragging inside a category: the dragged subset refills the slots that
  // category already holds in the full list, so every other category keeps
  // its place — and the result is exactly what a customer sees after tapping
  // the same chip on the site. (With "ทั้งหมด" every product is in the subset,
  // so this is a plain replacement.)
  const reorderShown = (nextShown: Product[]) => {
    setProducts((prev) => {
      const moving = new Set(nextShown.map((p) => p.ep));
      // A delete or save resolving mid-drag can make the subset disagree with
      // the list; skip that hover-swap rather than drop or duplicate a product.
      const slots = prev.filter((p) => moving.has(p.ep)).length;
      if (moving.size !== nextShown.length || slots !== nextShown.length) return prev;
      let i = 0;
      return prev.map((p) => (moving.has(p.ep) ? nextShown[i++] : p));
    });
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  const changeStatus = async (product: Product, status: ProductStatus) => {
    setBusyEp(product.ep);
    setError("");
    const res = await fetch(`/api/admin/products/${encodeURIComponent(product.ep)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...product, status }),
    });
    setBusyEp(null);
    if (res.ok) {
      const updated = (await res.json()) as Product;
      setProducts((prev) => prev.map((p) => (p.ep === product.ep ? updated : p)));
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "บันทึกไม่สำเร็จ");
    }
  };

  const remove = async (product: Product) => {
    if (!window.confirm(`ลบรหัส ${product.ep} และรูปทั้งหมด ${product.images.length} รูป?`)) return;
    setBusyEp(product.ep);
    setError("");
    const res = await fetch(`/api/admin/products/${encodeURIComponent(product.ep)}`, { method: "DELETE" });
    setBusyEp(null);
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.ep !== product.ep));
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "ลบไม่สำเร็จ");
    }
  };

  const persistOrder = async () => {
    setError("");
    const res = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: orderRef.current.map((p) => p.ep) }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "บันทึกลำดับไม่สำเร็จ");
    }
  };

  const onSaved = (saved: Product, previousEp?: string) => {
    setProducts((prev) =>
      previousEp ? prev.map((p) => (p.ep === previousEp ? saved : p)) : [saved, ...prev]
    );
    setEditing(null);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            🛠️ หลังบ้าน <span className="text-pink">panpangame</span>
          </h1>
          <p className="text-sm text-muted">จัดการรหัสทั้งหมด {products.length} รายการ</p>
        </div>
        <div className="flex gap-2">
          <Link href="/" className="rounded-xl border border-line bg-surface px-4 py-2 text-sm font-semibold text-muted hover:text-ink">
            ดูหน้าเว็บ
          </Link>
          <button onClick={logout} className="rounded-xl border border-line bg-surface px-4 py-2 text-sm font-semibold text-rose hover:border-rose/50">
            ออกจากระบบ
          </button>
        </div>
      </div>

      {error && <p className="mt-4 rounded-xl border border-rose/40 bg-rose/10 px-4 py-2 text-sm font-semibold text-rose">{error}</p>}

      <div className="mt-6">
        <CategoryChips order={categoryOrder} value={filter} onChange={setFilter} />
      </div>

      <button
        onClick={() => setEditing("new")}
        className="mt-4 w-full rounded-2xl border-2 border-dashed border-pink/40 bg-pink/5 py-4 font-bold text-pink transition hover:bg-pink/10"
      >
        ＋ เพิ่มรหัสใหม่
        {filter !== "all" && (
          <span className="font-semibold text-pink-soft">
            {" "}
            ในหมวด <span className="whitespace-nowrap">{CATEGORY_LABEL[filter]}</span>
          </span>
        )}
      </button>

      {shown.length > 0 && (
        <p className="mt-6 text-xs text-muted">
          {filter === "all" ? (
            "ลากที่ขีดสามขีดเพื่อสลับลำดับ — ลำดับนี้คือลำดับที่แสดงบนหน้าเว็บ"
          ) : (
            <>
              หมวด <span className="whitespace-nowrap">{CATEGORY_LABEL[filter]}</span> มี {shown.length} รายการ —
              ลากที่ขีดสามขีดเพื่อสลับลำดับภายในหมวดนี้ ตรงกับหน้าเว็บตอนลูกค้ากดหมวดเดียวกัน
            </>
          )}
        </p>
      )}
      <Reorder.Group axis="y" values={shown} onReorder={reorderShown} className="mt-3 space-y-3">
        {shown.map((p) => (
          <ProductRow
            key={p.ep}
            product={p}
            busy={busyEp === p.ep}
            onStatus={(status) => changeStatus(p, status)}
            onEdit={() => setEditing(p)}
            onRemove={() => remove(p)}
            onDropped={persistOrder}
          />
        ))}
      </Reorder.Group>
      {shown.length === 0 && (
        <p className="py-10 text-center text-muted">
          {filter === "all"
            ? "ยังไม่มีรหัส กด “เพิ่มรหัสใหม่” ได้เลย"
            : "ยังไม่มีรหัสในหมวดนี้ — กด “เพิ่มรหัสใหม่” แล้วฟอร์มจะเลือกหมวดนี้ให้เลย"}
        </p>
      )}

      <CategoryOrderPanel order={categoryOrder} onOrderChange={setCategoryOrder} />

      {editing && (
        <ProductForm
          product={editing === "new" ? null : editing}
          defaultCategory={filter === "all" ? undefined : filter}
          onClose={() => setEditing(null)}
          onSaved={onSaved}
        />
      )}
    </main>
  );
}
