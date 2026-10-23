import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Facilities Management Botswana",
    short_name: "Facilities",
    description: "Facilities maintenance for commercial properties, offices, schools, retail sites and hospitality facilities in Botswana.",
    start_url: "/",
    display: "standalone",
    background_color: "#6d28d9",
    theme_color: "#6d28d9",
    orientation: "portrait-primary",
    lang: "en",
    categories: ["business", "utilities"],
    icons: [
      { src: "/africhiko-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/africhiko-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" }
    ]
  };
}
