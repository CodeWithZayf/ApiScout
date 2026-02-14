import { Suspense } from "react";
import { Metadata } from "next";
import { apiFetch } from "@/lib/api";
import { ApiItem, Category, Tag, PaginatedResponse } from "@/lib/types";
import { ApisPageClient } from "./ApisPageClient";

export const metadata: Metadata = {
    title: "Browse APIs",
    description:
        "Discover and compare the best APIs for your project. Filter by category, pricing, auth type, and more.",
};

interface PageProps {
    searchParams: Promise<{
        search?: string;
        category?: string;
        pricingType?: string;
        authType?: string;
        tag?: string;
        sort?: string;
        page?: string;
    }>;
}

export default async function ApisPage({ searchParams }: PageProps) {
    const params = await searchParams;

    // Build query string
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.category) query.set("category", params.category);
    if (params.pricingType) query.set("pricingType", params.pricingType);
    if (params.authType) query.set("authType", params.authType);
    if (params.tag) query.set("tag", params.tag);
    if (params.sort) query.set("sort", params.sort);
    if (params.page) query.set("page", params.page);
    query.set("limit", "12");

    let apisData: PaginatedResponse<ApiItem> = {
        data: [],
        meta: { total: 0, page: 1, limit: 12, totalPages: 0 },
    };
    let categories: Category[] = [];
    let tags: Tag[] = [];

    try {
        [apisData, categories, tags] = await Promise.all([
            apiFetch<PaginatedResponse<ApiItem>>(`/apis?${query.toString()}`),
            apiFetch<Category[]>("/categories"),
            apiFetch<Tag[]>("/tags"),
        ]);
    } catch (error) {
        // Gracefully handle API errors — show empty state
        console.error("Failed to fetch APIs:", error);
    }

    return (
        <Suspense fallback={<ApisLoadingSkeleton />}>
            <ApisPageClient
                apis={apisData.data}
                categories={categories}
                tags={tags}
                meta={apisData.meta}
                currentFilters={{
                    search: params.search,
                    category: params.category,
                    pricingType: params.pricingType,
                    authType: params.authType,
                    tag: params.tag,
                    sort: params.sort,
                    page: params.page ? parseInt(params.page) : 1,
                }}
            />
        </Suspense>
    );
}

function ApisLoadingSkeleton() {
    return (
        <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="mb-8">
                <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
                <div className="mt-2 h-5 w-64 animate-pulse rounded-lg bg-gray-100" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-56 animate-pulse rounded-2xl border bg-gray-50" />
                ))}
            </div>
        </div>
    );
}
