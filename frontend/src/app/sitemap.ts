import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hybrid-steganography.org";
  const lastModified = new Date();

  const routes = [
    "",
    "/encode",
    "/decode",
    "/compare",
    "/dashboard",
    "/documentation",
    "/about",
    "/contact",
    "/design-system",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/encode" || route === "/decode" ? 0.9 : 0.8,
  }));
}
