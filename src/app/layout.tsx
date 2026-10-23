import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import PwaRegister from "@/app/pwa-register";
import "./globals.css";
import "./pwa.css";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Botswana Safari Experiences", template: "%s | Botswana Safari Experiences" },
  description: "Botswana Safari Experiences connects guests with safari stays, guided wildlife experiences and journeys across Botswana.",
  applicationName: "Botswana Safari Experiences",
  keywords: ["Botswana safari", "Okavango Delta", "Chobe", "Moremi", "safari lodge", "mobile safari", "guided game drives"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: siteUrl, siteName: "Botswana Safari Experiences", title: "Botswana Safari Experiences", description: "Discover safari stays, guided wildlife experiences and journeys across Botswana." },
  twitter: { card: "summary", title: "Botswana Safari Experiences", description: "Facilities maintenance in Botswana. Request service support for your property." },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Safari Experiences", statusBarStyle: "default" },
};

export const viewport: Viewport = { themeColor: "#23624d", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><PwaRegister />{children}<Analytics /><SpeedInsights /></body></html>;
}
