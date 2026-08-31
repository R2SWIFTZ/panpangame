import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Gallery from "@/components/Gallery";
import DetailActions from "@/components/DetailActions";
import StatusBadge from "@/components/StatusBadge";
import { readProducts } from "@/lib/store";
import { formatPrice } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: PageProps<"/id/[ep]">) {
  const { ep } = await params;
  const products = await readProducts();
  const product = products.find((p) => p.ep.toLowerCase() === decodeURIComponent(ep).toLowerCase());
  if (!product) notFound();

  return (
    <main>
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-muted transition hover:border-pink/40 hover:text-ink"
          >
            ← ย้อนกลับ
          </Link>
          <StatusBadge status={product.status} />
        </div>

        <div className="mt-5">
          <Gallery images={product.images} ep={product.ep} />
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-3xl font-bold tracking-wide sm:text-4xl">{product.ep}</h1>
          <p className="text-2xl font-bold text-pink sm:text-3xl">{formatPrice(product.price)}</p>
        </div>

        <section aria-label="รายละเอียดสินค้า" className="mt-5 rounded-2xl border border-line bg-card p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bold">📋 รายละเอียดสินค้า</h2>
          </div>
          <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-ink/90">
            {product.details.map((d, i) => (
              <li key={i}>– {d}</li>
            ))}
          </ul>
        </section>

        <DetailActions product={product} />
      </div>
      <SiteFooter />
    </main>
  );
}
