import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://hybrid-steganography.org";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/private/", "/admin/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
