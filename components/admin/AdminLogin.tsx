"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "เข้าสู่ระบบไม่สำเร็จ");
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-grid px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl border border-line bg-card p-8">
        <p className="text-center font-display text-2xl text-pink">
          panpan<span className="text-ink">game</span>
        </p>
        <p className="mt-1 text-center text-sm text-muted">หลังบ้านสำหรับแอดมิน</p>
        <label className="mt-6 block">
          <span className="text-sm font-semibold">รหัสผ่าน</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
            className="mt-1 w-full rounded-xl border border-line bg-surface px-4 py-2.5 outline-none transition focus:border-pink"
          />
        </label>
        {error && <p className="mt-2 text-sm font-semibold text-rose">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-pink py-3 font-bold text-white transition hover:bg-pink-strong disabled:opacity-50"
        >
          {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>
    </main>
  );
}
