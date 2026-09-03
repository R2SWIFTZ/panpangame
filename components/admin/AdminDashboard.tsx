"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Reorder } from "framer-motion";
import type { Product, ProductStatus } from "@/lib/types";
import ProductForm from "./ProductForm";
import ProductRow from "./ProductRow";

export default function AdminDashboard({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  // Latest order for the drag-end handler — Reorder fires onReorder on every
  // hover-swap, but we only persist once the grip is released.
  const orderRef = useRef(products);
  useEffect(() => {
    orderRef.current = products;
  }, [products]);
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [busyEp, setBusyEp] = useState<string | null>(null);
  const [error, setError] = useState("");

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

      <button
        onClick={() => setEditing("new")}
        className="mt-6 w-full rounded-2xl border-2 border-dashed border-pink/40 bg-pink/5 py-4 font-bold text-pink transition hover:bg-pink/10"
      >
        ＋ เพิ่มรหัสใหม่
      </button>

      {products.length > 0 && (
        <p className="mt-6 text-xs text-muted">ลากที่ขีดสามขีดเพื่อสลับลำดับ — ลำดับนี้คือลำดับที่แสดงบนหน้าเว็บ</p>
      )}
      <Reorder.Group axis="y" values={products} onReorder={setProducts} className="mt-3 space-y-3">
        {products.map((p) => (
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
      {products.length === 0 && <p className="py-10 text-center text-muted">ยังไม่มีรหัส กด &ldquo;เพิ่มรหัสใหม่&rdquo; ได้เลย</p>}

      {editing && (
        <ProductForm
          product={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={onSaved}
        />
      )}
    </main>
  );
}
