"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/config";

const links = [
  { href: "#products", label: "เลือกซื้อไอดี" },
  { href: "#how-to", label: "วิธีสั่งซื้อ" },
  { href: "#reviews", label: "รีวิวลูกค้า" },
  { href: "#faq", label: "คำถามที่พบบ่อย" },
  { href: "#contact", label: "ติดต่อร้าน" },
];

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-40 border-b-2 border-plum/10 bg-cream/90 backdrop-blur-md"
    >
      <nav aria-label="เมนูหลัก" className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="#top" className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-pink text-xl text-white sticker-shadow">
            🎮
          </span>
          <span className="font-display text-xl text-hotpink sm:text-2xl">
            PanPan<span className="text-plum">Game</span>
          </span>
          <span className="rotate-[3deg] rounded-md border border-plum/30 bg-butter px-1.5 py-0.5 text-[10px] font-bold text-plum">
            DEMO
          </span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-plum-soft transition hover:bg-blush hover:text-hotpink"
            >
              {l.label}
            </a>
          ))}
        </div>
        <a
          href="#products"
          className="rounded-full bg-plum px-4 py-2 text-sm font-semibold text-white transition hover:bg-hotpink sm:px-5"
        >
          ซื้อเลย 🔥
        </a>
      </nav>
    </motion.header>
  );
}
