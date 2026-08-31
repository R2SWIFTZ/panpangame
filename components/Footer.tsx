import { siteConfig } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="border-t-2 border-plum/10 bg-cream">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 text-center">
        <p className="font-display text-xl text-hotpink">
          PanPan<span className="text-plum">Game</span> 🎮
        </p>
        <p className="max-w-md text-sm text-plum-soft">{siteConfig.tagline}</p>
        <a
          href={siteConfig.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-hotpink underline underline-offset-4 hover:text-pink"
        >
          Facebook: {siteConfig.facebookName}
        </a>
        <p className="mt-2 text-xs text-plum-soft/70">
          © {new Date().getFullYear()} {siteConfig.name} — เว็บไซต์ตัวอย่าง (Demo) ข้อมูลสินค้าและรีวิวเป็นตัวอย่างเพื่อการแสดงผล
        </p>
      </div>
    </footer>
  );
}
