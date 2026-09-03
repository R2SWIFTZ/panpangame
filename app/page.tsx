import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HomeHero from "@/components/HomeHero";
import ProductGridHome from "@/components/ProductGridHome";
import HowTo from "@/components/HowTo";
import ContactSection from "@/components/ContactSection";
import { readCategoryOrder, readProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, categoryOrder] = await Promise.all([readProducts(), readCategoryOrder()]);
  const availableCount = products.filter((p) => p.status === "available").length;
  return (
    <main>
      <SiteHeader />
      <HomeHero availableCount={availableCount} />
      <ProductGridHome products={products} categoryOrder={categoryOrder} />
      <HowTo />
      <ContactSection />
      <SiteFooter />
    </main>
  );
}
