"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Star, Bookmark, ExternalLink, ArrowRight, Filter, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { ApiItem, Category, Tag } from "@/lib/types";
import { PRICING_LABELS, PRICING_COLORS, AUTH_LABELS, SORT_OPTIONS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ApisPageClientProps {
    apis: ApiItem[];
    categories: Category[];
    tags: Tag[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    currentFilters: {
        search?: string;
        category?: string;
        pricingType?: string;
        authType?: string;
        tag?: string;
        sort?: string;
        page?: number;
    };
}

export function ApisPageClient({
    apis,
    categories,
    tags,
    meta,
    currentFilters,
}: ApisPageClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);

    const updateFilter = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.delete("page"); // Reset page on filter change
        router.push(`/apis?${params.toString()}`);
    };

    const clearFilters = () => {
        router.push("/apis");
    };

    const hasActiveFilters =
        currentFilters.category ||
        currentFilters.pricingType ||
        currentFilters.authType ||
        currentFilters.tag;

    return (
        <div className="mx-auto max-w-7xl px-6 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Browse APIs</h1>
                <p className="mt-2 text-muted-foreground">
                    Discover {meta.total} APIs across {categories.length} categories
                </p>
            </div>

            {/* Search + Sort Bar */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 items-center gap-3">
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Search APIs..."
                            defaultValue={currentFilters.search || ""}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    updateFilter("search", (e.target as HTMLInputElement).value || null);
                                }
                            }}
                            className="w-full rounded-xl border bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        />
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="gap-2 rounded-xl"
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                        {hasActiveFilters && (
                            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
                                !
                            </span>
                        )}
                    </Button>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Sort:</span>
                    {SORT_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => updateFilter("sort", opt.value)}
                            className={`rounded-full px-3 py-1 transition ${(currentFilters.sort || "newest") === opt.value
                                    ? "bg-gray-900 text-white"
                                    : "text-muted-foreground hover:bg-muted"
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="mb-6 rounded-2xl border bg-gray-50/50 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Filters</h3>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-orange-600 hover:underline"
                            >
                                Clear all
                            </button>
                        )}
                    </div>

                    <div className="grid gap-6 md:grid-cols-4">
                        {/* Category */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-muted-foreground">
                                Category
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                                {categories.slice(0, 8).map((cat) => (
                                    <button
                                        key={cat.slug}
                                        onClick={() =>
                                            updateFilter(
                                                "category",
                                                currentFilters.category === cat.slug ? null : cat.slug
                                            )
                                        }
                                        className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${currentFilters.category === cat.slug
                                                ? "bg-gray-900 text-white"
                                                : "bg-white border text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Pricing */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-muted-foreground">
                                Pricing
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                                {(["FREE", "FREEMIUM", "PAID"] as const).map((pt) => (
                                    <button
                                        key={pt}
                                        onClick={() =>
                                            updateFilter(
                                                "pricingType",
                                                currentFilters.pricingType === pt ? null : pt
                                            )
                                        }
                                        className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${currentFilters.pricingType === pt
                                                ? "bg-gray-900 text-white"
                                                : "bg-white border text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        {PRICING_LABELS[pt]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Auth Type */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-muted-foreground">
                                Auth Method
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                                {(["API_KEY", "OAUTH", "NONE", "BEARER_TOKEN"] as const).map((at) => (
                                    <button
                                        key={at}
                                        onClick={() =>
                                            updateFilter(
                                                "authType",
                                                currentFilters.authType === at ? null : at
                                            )
                                        }
                                        className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${currentFilters.authType === at
                                                ? "bg-gray-900 text-white"
                                                : "bg-white border text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        {AUTH_LABELS[at]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-muted-foreground">
                                Tags
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                                {tags.slice(0, 8).map((tag) => (
                                    <button
                                        key={tag.slug}
                                        onClick={() =>
                                            updateFilter(
                                                "tag",
                                                currentFilters.tag === tag.slug ? null : tag.slug
                                            )
                                        }
                                        className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${currentFilters.tag === tag.slug
                                                ? "bg-gray-900 text-white"
                                                : "bg-white border text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        {tag.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Results */}
            {apis.length === 0 ? (
                <div className="rounded-2xl border bg-gray-50/50 py-20 text-center">
                    <p className="text-lg font-medium text-muted-foreground">No APIs found</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Try adjusting your search or filters
                    </p>
                    <Button onClick={clearFilters} className="mt-4 rounded-xl" variant="outline">
                        Clear filters
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {apis.map((api) => (
                        <ApiListCard key={api.id} api={api} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {meta.totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                    {meta.page > 1 && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl"
                            onClick={() => updateFilter("page", String(meta.page - 1))}
                        >
                            Previous
                        </Button>
                    )}
                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
                            const pageNum = i + 1;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => updateFilter("page", String(pageNum))}
                                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition ${meta.page === pageNum
                                            ? "bg-gray-900 text-white"
                                            : "text-muted-foreground hover:bg-muted"
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>
                    {meta.page < meta.totalPages && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl"
                            onClick={() => updateFilter("page", String(meta.page + 1))}
                        >
                            Next
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

function ApiListCard({ api }: { api: ApiItem }) {
    return (
        <Link href={`/api/${api.slug}`}>
            <div className="group rounded-2xl border bg-white p-6 transition hover:shadow-lg hover:border-orange-200">
                {/* Header */}
                <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 text-lg font-bold text-gray-700">
                            {api.name[0]}
                        </div>
                        <div>
                            <h3 className="font-semibold group-hover:text-orange-600 transition-colors">
                                {api.name}
                            </h3>
                            {api.providerName && (
                                <p className="text-xs text-muted-foreground">
                                    {api.providerName}
                                </p>
                            )}
                        </div>
                    </div>
                    {api.isFeatured && (
                        <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                            Featured
                        </span>
                    )}
                </div>

                {/* Description */}
                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                    {api.description}
                </p>

                {/* Tags */}
                <div className="mb-4 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                        {api.category.name}
                    </span>
                    <span
                        className={`rounded-md px-2 py-0.5 text-xs font-medium ${PRICING_COLORS[api.pricingType]
                            }`}
                    >
                        {PRICING_LABELS[api.pricingType]}
                    </span>
                    {api.tags.slice(0, 2).map((tag) => (
                        <span
                            key={tag.id}
                            className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                        >
                            {tag.name}
                        </span>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t pt-3 text-sm">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
                            <span className="font-medium">{api.averageRating.toFixed(1)}</span>
                            <span className="text-muted-foreground text-xs">({api.reviewCount})</span>
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Bookmark className="h-3 w-3" />
                            {api.bookmarkCount}
                        </span>
                    </div>
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                        {AUTH_LABELS[api.authType]}
                    </span>
                </div>
            </div>
        </Link>
    );
}
