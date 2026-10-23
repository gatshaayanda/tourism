import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Botswana Safari Experiences",
    short_name: "Safari BW",
    description: "Safari stays, guided game drives, mobile safaris and nature experiences across Botswana.",
    start_url: "/",
    display: "standalone",
    background_color: "#23624d",
    theme_color: "#23624d",
    orientation: "portrait-primary",
    lang: "en",
    categories: ["travel", "lifestyle"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" }
    ]
  };
}
