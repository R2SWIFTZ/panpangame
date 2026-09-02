import Link from "next/link";
import { siteConfig } from "@/lib/config";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
      <nav aria-label="เมนูหลัก" className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-pink text-lg glow-pink">🎮</span>
          <span className="font-display text-xl text-pink">
            panpan<span className="text-ink">game</span>
          </span>
          <span className="rounded-md border border-pink/40 px-1.5 py-0.5 text-[10px] font-bold text-pink-soft">
            DEMO
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/#contact"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted transition hover:text-pink-soft sm:block"
          >
            ติดต่อร้าน
          </Link>
          <a
            href={siteConfig.lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-[#06C755] px-4 py-2 text-sm font-bold text-white transition hover:brightness-110"
          >
            LINE<span className="hidden sm:inline"> {siteConfig.lineId}</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
