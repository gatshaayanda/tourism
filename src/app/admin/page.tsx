import type { Metadata } from "next";
import AfrichikoPortal from "@/components/AfrichikoPortal";

export const metadata: Metadata = {
  title: "Facilities service operations",
  description: "Review service requests and manage facilities maintenance services.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AfrichikoPortal page="admin" />;
}
