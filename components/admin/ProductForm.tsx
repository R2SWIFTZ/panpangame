"use client";

import { useState } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { STATUS_LABEL, STATUS_ORDER, type Product, type ProductStatus } from "@/lib/types";

type Props = {
  product: Product | null; // null = สร้างใหม่
  onClose: () => void;
  onSaved: (saved: Product, previousEp?: string) => void;
};

export default function ProductForm({ product, onClose, onSaved }: Props) {
  const [ep, setEp] = useState(product?.ep ?? "EP");
  const [price, setPrice] = useState(product ? String(product.price) : "0");
  const [details, setDetails] = useState(product?.details.join("\n") ?? "");
  const [status, setStatus] = useState<ProductStatus>(product?.status ?? "available");
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        const blob = await upload(`ids/${ep || "misc"}/${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/admin/upload",
        });
        setImages((prev) => [...prev, blob.url]);
      }
    } catch (e) {
      setError(`อัปโหลดรูปไม่สำเร็จ: ${(e as Error).message}`);
    }
    setUploading(false);
  };

  const moveToFront = (url: string) => setImages((prev) => [url, ...prev.filter((u) => u !== url)]);
  const removeImage = (url: string) => setImages((prev) => prev.filter((u) => u !== url));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ep,
      price: Number(price) || 0,
      details: details.split("\n").map((d) => d.trim()).filter(Boolean),
      images,
      status,
    };
    const res = product
      ? await fetch(`/api/admin/products/${encodeURIComponent(product.ep)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
    setSaving(false);
    if (res.ok) {
      onSaved((await res.json()) as Product, product?.ep);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "บันทึกไม่สำเร็จ");
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <form
        onSubmit={save}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-line bg-card p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{product ? `แก้ไข ${product.ep}` : "เพิ่มรหัสใหม่"}</h2>
          <button type="button" onClick={onClose} aria-label="ปิด" className="rounded-full bg-surface px-3 py-1 font-bold text-muted hover:text-ink">
            ✕
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold">รหัส EP</span>
            <input
              value={ep}
              onChange={(e) => setEp(e.target.value.toUpperCase())}
              required
              placeholder="EP6431"
              className="mt-1 w-full rounded-xl border border-line bg-surface px-4 py-2.5 outline-none focus:border-pink"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">ราคา (บาท) — ใส่ 0 = สอบถามราคา</span>
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-surface px-4 py-2.5 outline-none focus:border-pink"
            />
          </label>
        </div>

        <label className="mt-4 block">
          <span className="text-sm font-semibold">สถานะ</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProductStatus)}
            className="mt-1 w-full rounded-xl border border-line bg-surface px-4 py-2.5 outline-none focus:border-pink"
          >
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-semibold">รายละเอียด (บรรทัดละ 1 ข้อ)</span>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={5}
            placeholder={"เลเวล 73\nปืนวิวัฒน์ Lv.7 หลายกระบอก\nยกรหัสให้ทั้งอีเมล"}
            className="mt-1 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm outline-none focus:border-pink"
          />
        </label>

        <div className="mt-4">
          <span className="text-sm font-semibold">รูปภาพ ({images.length}) — รูปแรกคือรูปหน้าปก</span>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {images.map((url, i) => (
              <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border border-line">
                <Image src={url} alt="" fill sizes="120px" className="object-cover" />
                {i === 0 && (
                  <span className="absolute left-1 top-1 rounded bg-pink px-1 text-[10px] font-bold text-white">ปก</span>
                )}
                <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/60 opacity-0 transition group-hover:opacity-100">
                  {i !== 0 && (
                    <button type="button" onClick={() => moveToFront(url)} title="ตั้งเป็นรูปปก" className="rounded bg-surface px-1.5 py-0.5 text-xs">
                      ⭐
                    </button>
                  )}
                  <button type="button" onClick={() => removeImage(url)} title="ลบรูป" className="rounded bg-rose px-1.5 py-0.5 text-xs text-white">
                    🗑
                  </button>
                </div>
              </div>
            ))}
            <label className="grid aspect-square cursor-pointer place-items-center rounded-lg border-2 border-dashed border-pink/40 text-2xl text-pink transition hover:bg-pink/10">
              {uploading ? "⏳" : "＋"}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={uploading}
                onChange={(e) => handleFiles(e.target.files)}
              />
            </label>
          </div>
        </div>

        {error && <p className="mt-4 rounded-xl border border-rose/40 bg-rose/10 px-4 py-2 text-sm font-semibold text-rose">{error}</p>}

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={saving || uploading}
            className="flex-1 rounded-xl bg-pink py-3 font-bold text-white transition hover:bg-pink-strong disabled:opacity-50"
          >
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
          <button type="button" onClick={onClose} className="rounded-xl border border-line bg-surface px-6 py-3 font-semibold text-muted hover:text-ink">
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
}
