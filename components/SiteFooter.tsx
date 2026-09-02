import { siteConfig } from "@/lib/config";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-10 text-center">
        <p className="font-display text-xl text-pink">
          panpan<span className="text-ink">game</span>
        </p>
        <p className="max-w-md text-sm text-muted">{siteConfig.tagline}</p>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm">
          <a href={siteConfig.lineUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-mint hover:underline">
            LINE {siteConfig.lineId}
          </a>
          {siteConfig.facebookPages.map((f) => (
            <a key={f.url} href={f.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-sky hover:underline">
              {f.label}
            </a>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted/60">
          © {new Date().getFullYear()} {siteConfig.name} — เว็บไซต์ตัวอย่าง (Demo)
        </p>
      </div>
    </footer>
  );
}
