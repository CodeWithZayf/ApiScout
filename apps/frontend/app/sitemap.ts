import type { MetadataRoute } from "next";
import { apiFetch } from "@/lib/api";
import { ApiItem, Category, PaginatedResponse } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://apiscout.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticPages: MetadataRoute.Sitemap = [
        { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
        { url: `${BASE_URL}/apis`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
        { url: `${BASE_URL}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
        { url: `${BASE_URL}/compare`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
        { url: `${BASE_URL}/trending`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
        { url: `${BASE_URL}/submit`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
        { url: `${BASE_URL}/login`, changeFrequency: "monthly", priority: 0.3 },
        { url: `${BASE_URL}/signup`, changeFrequency: "monthly", priority: 0.3 },
    ];

    let apiPages: MetadataRoute.Sitemap = [];
    let categoryPages: MetadataRoute.Sitemap = [];

    try {
        const [apisRes, categories] = await Promise.all([
            apiFetch<PaginatedResponse<ApiItem>>("/apis?limit=100"),
            apiFetch<Category[]>("/categories"),
        ]);

        apiPages = apisRes.data.map((api) => ({
            url: `${BASE_URL}/api/${api.slug}`,
            lastModified: new Date(api.updatedAt),
            changeFrequency: "weekly" as const,
            priority: 0.7,
        }));

        categoryPages = categories.map((cat) => ({
            url: `${BASE_URL}/categories/${cat.slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.6,
        }));
    } catch {
        // Fail silently — static pages still get indexed
    }

    return [...staticPages, ...apiPages, ...categoryPages];
}
