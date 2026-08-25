import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://maxiviews.me";

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = ["", "/contact", "/sign-in", "/sign-up"];

    return routes.map((route) => ({
        url: `${siteUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.6,
    }));
}
