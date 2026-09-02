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

export const metadata: Metadata = {
  title: `${siteConfig.name} — ร้านขายรหัส Free Fire`,
  description: siteConfig.tagline,
  openGraph: {
    title: `${siteConfig.name} — ร้านขายรหัส Free Fire`,
    description: siteConfig.tagline,
    locale: "th_TH",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${anuphan.variable} ${prompt.variable} antialiased`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
