"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatPrice, STATUS_LABEL, STATUS_ORDER, type Product, type ProductStatus } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";
import ProductForm from "./ProductForm";

export default function AdminDashboard({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
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
            🛠️ หลังบ้าน <span className="text-pink">PanPanGame</span>
          </h1>
          <p className="text-sm text-muted">จัดการรหัสทั้งหมด {products.length} รายการ</p>
        </div>
        <div className="flex gap-2">
          <a href="/" className="rounded-xl border border-line bg-surface px-4 py-2 text-sm font-semibold text-muted hover:text-ink">
            ดูหน้าเว็บ
          </a>
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

      <div className="mt-6 space-y-3">
        {products.map((p) => (
          <div key={p.ep} className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-card p-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface">
              {p.images[0] ? (
                <Image src={p.images[0]} alt="" fill sizes="64px" className="object-cover" />
              ) : (
                <div className="grid h-full place-items-center text-2xl">🔥</div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-bold tracking-wide">{p.ep}</p>
                <StatusBadge status={p.status} />
              </div>
              <p className="text-sm text-muted">
                {formatPrice(p.price)} · {p.images.length} รูป · {p.details.length} รายละเอียด
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={p.status}
                disabled={busyEp === p.ep}
                onChange={(e) => changeStatus(p, e.target.value as ProductStatus)}
                aria-label={`เปลี่ยนสถานะ ${p.ep}`}
                className="rounded-xl border border-line bg-surface px-3 py-2 text-sm font-semibold outline-none focus:border-pink"
              >
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setEditing(p)}
                className="rounded-xl border border-line bg-surface px-4 py-2 text-sm font-semibold hover:border-pink/50"
              >
                แก้ไข
              </button>
              <button
                onClick={() => remove(p)}
                disabled={busyEp === p.ep}
                className="rounded-xl border border-line bg-surface px-3 py-2 text-sm font-semibold text-rose hover:border-rose/50 disabled:opacity-50"
              >
                ลบ
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && <p className="py-10 text-center text-muted">ยังไม่มีรหัส กด "เพิ่มรหัสใหม่" ได้เลย</p>}
      </div>

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
