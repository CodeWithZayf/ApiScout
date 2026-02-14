"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    Plus,
    X,
    Search,
    Star,
    Shield,
    Zap,
    Code,
    DollarSign,
    ExternalLink,
    ArrowRight,
} from "lucide-react";
import { ApiItem } from "@/lib/types";
import { apiFetch, API_BASE_URL } from "@/lib/api";
import {
    PRICING_LABELS,
    PRICING_COLORS,
    AUTH_LABELS,
    RATE_LIMIT_LABELS,
    DIFFICULTY_LABELS,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";

export default function ComparePage() {
    return (
        <Suspense fallback={
            <div className="mx-auto max-w-7xl px-6 py-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 w-48 rounded-lg bg-gray-200" />
                    <div className="h-4 w-72 rounded bg-gray-100" />
                </div>
            </div>
        }>
            <CompareContent />
        </Suspense>
    );
}

function CompareContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [apis, setApis] = useState<ApiItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<ApiItem[]>([]);
    const [searching, setSearching] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    // Load APIs from URL params on mount
    useEffect(() => {
        const slugs = searchParams.get("apis")?.split(",").filter(Boolean) || [];
        if (slugs.length > 0) {
            Promise.all(slugs.map((s) => apiFetch<ApiItem>(`/apis/${s}`).catch(() => null)))
                .then((results) => setApis(results.filter(Boolean) as ApiItem[]));
        }
    }, [searchParams]);

    const updateUrl = (newApis: ApiItem[]) => {
        const slugs = newApis.map((a) => a.slug).join(",");
        router.replace(slugs ? `/compare?apis=${slugs}` : "/compare", { scroll: false });
    };

    const handleSearch = async (q: string) => {
        setSearchQuery(q);
        if (q.length < 2) {
            setSearchResults([]);
            return;
        }
        setSearching(true);
        try {
            const res = await fetch(`${API_BASE_URL}/apis?search=${encodeURIComponent(q)}&limit=5`);
            const data = await res.json();
            const results = data.data || data;
            setSearchResults(
                (Array.isArray(results) ? results : []).filter(
                    (r: ApiItem) => !apis.some((a) => a.id === r.id)
                )
            );
        } catch {
            setSearchResults([]);
        }
        setSearching(false);
    };

    const addApi = (api: ApiItem) => {
        if (apis.length >= 4) return;
        const newApis = [...apis, api];
        setApis(newApis);
        updateUrl(newApis);
        setShowSearch(false);
        setSearchQuery("");
        setSearchResults([]);
    };

    const removeApi = (id: string) => {
        const newApis = apis.filter((a) => a.id !== id);
        setApis(newApis);
        updateUrl(newApis);
    };

    const comparisonRows = [
        {
            label: "Rating",
            icon: <Star className="h-4 w-4 text-orange-400" />,
            render: (api: ApiItem) => (
                <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
                    <span className="font-semibold">{api.averageRating.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">({api.reviewCount})</span>
                </div>
            ),
        },
        {
            label: "Pricing",
            icon: <DollarSign className="h-4 w-4 text-green-500" />,
            render: (api: ApiItem) => (
                <span className={`rounded-lg px-2.5 py-1 text-xs font-medium ${PRICING_COLORS[api.pricingType]}`}>
                    {PRICING_LABELS[api.pricingType]}
                </span>
            ),
        },
        {
            label: "Auth",
            icon: <Shield className="h-4 w-4 text-purple-500" />,
            render: (api: ApiItem) => <span className="text-sm">{AUTH_LABELS[api.authType]}</span>,
        },
        {
            label: "Rate Limit",
            icon: <Zap className="h-4 w-4 text-yellow-500" />,
            render: (api: ApiItem) => <span className="text-sm">{RATE_LIMIT_LABELS[api.rateLimit]}</span>,
        },
        {
            label: "Difficulty",
            icon: <Code className="h-4 w-4 text-blue-500" />,
            render: (api: ApiItem) => <span className="text-sm">{DIFFICULTY_LABELS[api.difficultyLevel]}</span>,
        },
        {
            label: "Category",
            icon: null,
            render: (api: ApiItem) => (
                <Link href={`/categories/${api.category.slug}`} className="text-sm text-orange-600 hover:underline">
                    {api.category.name}
                </Link>
            ),
        },
        {
            label: "Popularity",
            icon: null,
            render: (api: ApiItem) => (
                <div className="text-sm">
                    <span className="font-medium">{api.viewCount}</span>
                    <span className="text-muted-foreground"> views · </span>
                    <span className="font-medium">{api.bookmarkCount}</span>
                    <span className="text-muted-foreground"> saves</span>
                </div>
            ),
        },
        {
            label: "Open Source",
            icon: null,
            render: (api: ApiItem) => (
                <span className={`text-sm font-medium ${api.isOpenSource ? "text-green-600" : "text-gray-400"}`}>
                    {api.isOpenSource ? "Yes" : "No"}
                </span>
            ),
        },
    ];

    return (
        <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Compare APIs</h1>
                <p className="mt-2 text-muted-foreground">
                    Side-by-side comparison of up to 4 APIs
                </p>
            </div>

            {apis.length === 0 ? (
                /* Empty State */
                <div className="rounded-2xl border border-dashed bg-gray-50/50 py-20 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                        <Plus className="h-7 w-7 text-gray-400" />
                    </div>
                    <h2 className="text-lg font-semibold">Start comparing</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Search and add APIs to compare side by side
                    </p>
                    <div className="mx-auto mt-6 max-w-sm">
                        <div className="flex items-center rounded-xl border bg-white shadow-sm">
                            <Search className="ml-3 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search APIs..."
                                className="flex-1 bg-transparent px-3 py-3 text-sm outline-none"
                            />
                        </div>
                        {searchResults.length > 0 && (
                            <div className="mt-2 rounded-xl border bg-white p-2 shadow-lg">
                                {searchResults.map((r) => (
                                    <button
                                        key={r.id}
                                        onClick={() => addApi(r)}
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-gray-50"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 text-sm font-bold text-white">
                                            {r.name[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{r.name}</p>
                                            <p className="text-xs text-muted-foreground">{r.category.name}</p>
                                        </div>
                                        <Plus className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* Comparison Table */
                <div>
                    {/* API Headers */}
                    <div className="mb-6 grid gap-4" style={{ gridTemplateColumns: `200px repeat(${apis.length}, 1fr)${apis.length < 4 ? " 120px" : ""}` }}>
                        <div /> {/* Label column spacer */}
                        {apis.map((api) => (
                            <div key={api.id} className="rounded-2xl border bg-white p-5 relative group">
                                <button
                                    onClick={() => removeApi(api.id)}
                                    className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-lg bg-gray-100 opacity-0 transition group-hover:opacity-100 hover:bg-red-100 hover:text-red-600"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 text-xl font-bold text-white mb-3">
                                    {api.name[0]}
                                </div>
                                <h3 className="font-semibold">{api.name}</h3>
                                {api.providerName && (
                                    <p className="text-xs text-muted-foreground">by {api.providerName}</p>
                                )}
                                <div className="mt-3">
                                    <Link href={`/api/${api.slug}`}>
                                        <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs w-full">
                                            View Details <ArrowRight className="h-3 w-3" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                        {apis.length < 4 && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowSearch(!showSearch)}
                                    className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-dashed bg-gray-50/50 p-4 text-muted-foreground transition hover:bg-gray-100 hover:text-foreground min-h-[140px]"
                                >
                                    <Plus className="h-5 w-5 mb-1" />
                                    <span className="text-xs font-medium">Add API</span>
                                </button>
                                {showSearch && (
                                    <div className="absolute top-full left-0 mt-2 w-72 z-10 rounded-xl border bg-white p-3 shadow-lg">
                                        <div className="flex items-center rounded-lg border bg-gray-50 px-3">
                                            <Search className="h-3.5 w-3.5 text-muted-foreground" />
                                            <input
                                                type="text"
                                                autoFocus
                                                value={searchQuery}
                                                onChange={(e) => handleSearch(e.target.value)}
                                                placeholder="Search APIs..."
                                                className="flex-1 bg-transparent px-2 py-2 text-sm outline-none"
                                            />
                                        </div>
                                        {searchResults.length > 0 && (
                                            <div className="mt-2 space-y-1">
                                                {searchResults.map((r) => (
                                                    <button
                                                        key={r.id}
                                                        onClick={() => addApi(r)}
                                                        className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-gray-50"
                                                    >
                                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 text-xs font-bold text-white">
                                                            {r.name[0]}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium truncate">{r.name}</p>
                                                            <p className="text-xs text-muted-foreground">{r.category.name}</p>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Comparison Rows */}
                    <div className="rounded-2xl border bg-white overflow-hidden">
                        {comparisonRows.map((row, i) => (
                            <div
                                key={row.label}
                                className={`grid items-center gap-4 px-5 py-4 ${i % 2 === 0 ? "bg-gray-50/50" : ""
                                    } ${i < comparisonRows.length - 1 ? "border-b" : ""}`}
                                style={{ gridTemplateColumns: `200px repeat(${apis.length}, 1fr)` }}
                            >
                                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                    {row.icon}
                                    {row.label}
                                </div>
                                {apis.map((api) => (
                                    <div key={api.id}>{row.render(api)}</div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
