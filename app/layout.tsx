import type { Metadata } from "next";
import { Chonburi, Prompt } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/config";

const chonburi = Chonburi({
  variable: "--font-chonburi",
  weight: "400",
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
  title: `${siteConfig.name} — ร้านขายไอดี Free Fire ปลอดภัย ส่งไว`,
  description: siteConfig.tagline,
  openGraph: {
    title: `${siteConfig.name} — ร้านขายไอดี Free Fire`,
    description: siteConfig.tagline,
    locale: "th_TH",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${chonburi.variable} ${prompt.variable} antialiased`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
