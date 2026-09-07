import type { Metadata } from "next";
import { Anuphan, Prompt } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/config";

// Clean, low-contrast Thai sans for the big type moments (hero, wordmark) —
// deliberately not a display serif; matches the applesupps.me feel.
const anuphan = Anuphan({
  variable: "--font-anuphan",
  weight: ["500", "600", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
});

const prompt = Prompt({
  variable: "--font-prompt",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
});

const SITE_TITLE = `${siteConfig.name} - ซื้อขายรหัส Free Fire`;

export const metadata: Metadata = {
  // Absolute base so og:image resolves for LINE / Messenger / iMessage scrapers.
  metadataBase: new URL(siteConfig.url),
  title: SITE_TITLE,
  description: siteConfig.tagline,
  openGraph: {
    title: SITE_TITLE,
    description: siteConfig.tagline,
    siteName: siteConfig.name,
    url: "/",
    locale: "th_TH",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 1200, alt: SITE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: siteConfig.tagline,
    images: ["/og.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${anuphan.variable} ${prompt.variable} antialiased`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
