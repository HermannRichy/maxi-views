import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://maxiviews.me";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/dashboard",
                "/dashboard/",
                "/admin",
                "/admin/",
                "/api/",
                "/sso-callback",
            ],
        },
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
