import { Metadata } from "next";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { ApiItem, PaginatedResponse } from "@/lib/types";
import { PRICING_LABELS, PRICING_COLORS } from "@/lib/constants";
import {
    TrendingUp,
    Star,
    Flame,
    Crown,
    ArrowRight,
    Eye,
    Bookmark,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Trending & Popular APIs | APIScout",
    description: "Discover trending, most popular, and top-rated APIs on APIScout.",
};

export default async function TrendingPage() {
    let trending: ApiItem[] = [];
    let popular: ApiItem[] = [];
    let topRated: ApiItem[] = [];
    let featured: ApiItem[] = [];

    try {
        const [trendRes, popRes, ratedRes, featRes] = await Promise.all([
            apiFetch<PaginatedResponse<ApiItem>>("/apis?sort=popular&limit=6").catch(() => ({ data: [], meta: { total: 0, page: 1, limit: 6, totalPages: 0 } })),
            apiFetch<PaginatedResponse<ApiItem>>("/apis?sort=popular&limit=8").catch(() => ({ data: [], meta: { total: 0, page: 1, limit: 8, totalPages: 0 } })),
            apiFetch<PaginatedResponse<ApiItem>>("/apis?sort=rating&limit=6").catch(() => ({ data: [], meta: { total: 0, page: 1, limit: 6, totalPages: 0 } })),
            apiFetch<PaginatedResponse<ApiItem>>("/apis?featured=true&limit=4").catch(() => ({ data: [], meta: { total: 0, page: 1, limit: 4, totalPages: 0 } })),
        ]);
        trending = trendRes.data;
        popular = popRes.data;
        topRated = ratedRes.data;
        featured = featRes.data;
    } catch (e) {
        console.error("Failed to fetch trending data:", e);
    }

    return (
        <div className="mx-auto max-w-7xl px-6 py-8 space-y-12">
            {/* Hero */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <Flame className="h-8 w-8 text-orange-500" />
                    Trending & Popular
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Discover what developers are using and loving right now
                </p>
            </div>

            {/* Featured APIs */}
            {featured.length > 0 && (
                <section>
                    <div className="mb-4 flex items-center gap-2">
                        <Crown className="h-5 w-5 text-yellow-500" />
                        <h2 className="text-lg font-semibold">Featured</h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {featured.map((api) => (
                            <FeaturedCard key={api.id} api={api} />
                        ))}
                    </div>
                </section>
            )}

            {/* Trending Now */}
            <section>
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-orange-500" />
                        <h2 className="text-lg font-semibold">Trending Now</h2>
                    </div>
                    <Link href="/apis?sort=popular" className="text-sm text-orange-600 hover:underline flex items-center gap-1">
                        View all <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {trending.map((api, i) => (
                        <RankedCard key={api.id} api={api} rank={i + 1} />
                    ))}
                </div>
            </section>

            {/* Top Rated */}
            <section>
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <h2 className="text-lg font-semibold">Top Rated</h2>
                    </div>
                    <Link href="/apis?sort=rating" className="text-sm text-orange-600 hover:underline flex items-center gap-1">
                        View all <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {topRated.map((api, i) => (
                        <RankedCard key={api.id} api={api} rank={i + 1} showRating />
                    ))}
                </div>
            </section>
        </div>
    );
}

function FeaturedCard({ api }: { api: ApiItem }) {
    return (
        <Link href={`/api/${api.slug}`}>
            <div className="group rounded-2xl border bg-gradient-to-br from-orange-50 to-white p-5 transition hover:shadow-lg hover:border-orange-200">
                <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 text-lg font-bold text-white">
                        {api.name[0]}
                    </div>
                    <div>
                        <p className="font-semibold group-hover:text-orange-600 transition-colors">{api.name}</p>
                        {api.providerName && <p className="text-xs text-muted-foreground">{api.providerName}</p>}
                    </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{api.description}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                        {api.averageRating.toFixed(1)}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 font-medium ${PRICING_COLORS[api.pricingType]}`}>
                        {PRICING_LABELS[api.pricingType]}
                    </span>
                </div>
            </div>
        </Link>
    );
}

function RankedCard({ api, rank, showRating }: { api: ApiItem; rank: number; showRating?: boolean }) {
    return (
        <Link href={`/api/${api.slug}`}>
            <div className="group flex items-center gap-4 rounded-xl border bg-white p-4 transition hover:shadow-md hover:border-orange-200">
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${rank <= 3 ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"
                    }`}>
                    {rank}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 text-lg font-bold text-white shrink-0">
                    {api.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-medium group-hover:text-orange-600 transition-colors truncate">{api.name}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" /> {api.viewCount}
                        </span>
                        <span className="flex items-center gap-1">
                            <Bookmark className="h-3 w-3" /> {api.bookmarkCount}
                        </span>
                        {showRating && (
                            <span className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                                {api.averageRating.toFixed(1)}
                            </span>
                        )}
                    </div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRICING_COLORS[api.pricingType]}`}>
                    {PRICING_LABELS[api.pricingType]}
                </span>
            </div>
        </Link>
    );
}
