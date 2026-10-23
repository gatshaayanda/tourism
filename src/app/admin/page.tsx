import type { Metadata } from "next";
import AfrichikoPortal from "@/components/AfrichikoPortal";

export const metadata: Metadata = {
  title: "Safari and travel operations",
  description: "Review trip enquiries and manage safari experiences, announcements and featured listings.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AfrichikoPortal page="admin" />;
}
