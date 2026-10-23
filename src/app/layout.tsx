import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import PwaRegister from "@/app/pwa-register";
import "./globals.css";
import "./pwa.css";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Facilities Management Botswana", template: "%s | Facilities" },
  description: "Facilities Management Botswana supports commercial properties, offices, schools, retail sites and hospitality facilities with maintenance and site care.",
  applicationName: "Facilities",
  keywords: ["Facilities", "Botswana facilities management", "property maintenance", "commercial cleaning", "building systems"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: siteUrl, siteName: "Facilities", title: "Facilities Management Botswana", description: "Facilities maintenance in Botswana. Request service support for your property." },
  twitter: { card: "summary", title: "Facilities Management Botswana", description: "Facilities maintenance in Botswana. Request service support for your property." },
  icons: { icon: "/africhiko-icon.svg", apple: "/africhiko-icon.svg" },
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Facilities", statusBarStyle: "default" },
};

export const viewport: Viewport = { themeColor: "#6d28d9", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><PwaRegister />{children}<Analytics /><SpeedInsights /></body></html>;
}
