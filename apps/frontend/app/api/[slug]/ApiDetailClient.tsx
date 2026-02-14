"use client";

import { useEffect } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/api";
import {
    Star,
    ExternalLink,
    Globe,
    FileText,
    Shield,
    Zap,
    ChevronLeft,
    Code,
    DollarSign,
} from "lucide-react";
import { ApiDetail, Review, PaginatedResponse } from "@/lib/types";
import {
    PRICING_LABELS,
    PRICING_COLORS,
    AUTH_LABELS,
    RATE_LIMIT_LABELS,
    DIFFICULTY_LABELS,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookmarkButton } from "@/components/api/BookmarkButton";
import { ReviewForm } from "@/components/api/ReviewForm";
import { FeedbackButtons } from "@/components/api/FeedbackButtons";

interface Props {
    api: ApiDetail;
    initialReviews: PaginatedResponse<Review>;
}

export function ApiDetailClient({ api, initialReviews }: Props) {
    // Track view count once on mount (client-side only)
    useEffect(() => {
        fetch(`${API_BASE_URL}/apis/${api.slug}/view`, { method: 'POST' }).catch(() => { });
    }, [api.slug]);

    let useCases: string[] = [];
    try {
        useCases = api.useCases ? JSON.parse(api.useCases) : [];
    } catch {
        useCases = [];
    }

    return (
        <div className="mx-auto max-w-6xl px-6 py-8">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/apis" className="hover:text-foreground transition-colors flex items-center gap-1">
                    <ChevronLeft className="h-3.5 w-3.5" />
                    APIs
                </Link>
                <span>/</span>
                <Link
                    href={`/categories/${api.category.slug}`}
                    className="hover:text-foreground transition-colors"
                >
                    {api.category.name}
                </Link>
                <span>/</span>
                <span className="text-foreground">{api.name}</span>
            </nav>

            {/* Hero Section */}
            <div className="mb-8 rounded-2xl border bg-white p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 text-2xl font-bold text-white shadow-lg shadow-orange-500/25">
                                {api.name[0]}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl font-bold">{api.name}</h1>
                                    {api.isFeatured && (
                                        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                                            Featured
                                        </Badge>
                                    )}
                                </div>
                                {api.providerName && (
                                    <p className="text-sm text-muted-foreground">by {api.providerName}</p>
                                )}
                            </div>
                        </div>

                        <p className="text-base text-muted-foreground leading-relaxed mb-6">
                            {api.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap items-center gap-2 mb-6">
                            <span className="rounded-lg bg-muted px-3 py-1 text-sm font-medium">
                                {api.category.name}
                            </span>
                            <span
                                className={`rounded-lg px-3 py-1 text-sm font-medium ${PRICING_COLORS[api.pricingType]
                                    }`}
                            >
                                {PRICING_LABELS[api.pricingType]}
                            </span>
                            {api.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-600"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3">
                            <a href={api.documentationUrl} target="_blank" rel="noopener noreferrer">
                                <Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-xl gap-2">
                                    <FileText className="h-4 w-4" />
                                    View Documentation
                                </Button>
                            </a>
                            <a href={api.websiteUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="rounded-xl gap-2">
                                    <Globe className="h-4 w-4" />
                                    Website
                                </Button>
                            </a>
                            {api.dashboardUrl && (
                                <a href={api.dashboardUrl} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" className="rounded-xl gap-2">
                                        <ExternalLink className="h-4 w-4" />
                                        Dashboard
                                    </Button>
                                </a>
                            )}
                            {api.pricingUrl && (
                                <a href={api.pricingUrl} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" className="rounded-xl gap-2">
                                        <DollarSign className="h-4 w-4" />
                                        Pricing
                                    </Button>
                                </a>
                            )}
                            <BookmarkButton apiId={api.id} bookmarkCount={api.bookmarkCount} />
                        </div>
                    </div>

                    {/* Stats sidebar */}
                    <div className="flex flex-col gap-3 md:min-w-[200px]">
                        <div className="rounded-xl border bg-gray-50/50 p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                                <span className="text-lg font-bold">
                                    {api.averageRating.toFixed(1)}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {api.reviewCount} reviews
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-xl border bg-gray-50/50 p-3 text-center">
                                <p className="text-lg font-bold">{formatNumber(api.viewCount)}</p>
                                <p className="text-xs text-muted-foreground">Views</p>
                            </div>
                            <div className="rounded-xl border bg-gray-50/50 p-3 text-center">
                                <p className="text-lg font-bold">{formatNumber(api.bookmarkCount)}</p>
                                <p className="text-xs text-muted-foreground">Saves</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Grid */}
            <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <InfoCard
                    icon={<Shield className="h-5 w-5 text-purple-500" />}
                    label="Authentication"
                    value={AUTH_LABELS[api.authType]}
                    detail={api.authDescription}
                />
                <InfoCard
                    icon={<Zap className="h-5 w-5 text-yellow-500" />}
                    label="Rate Limits"
                    value={RATE_LIMIT_LABELS[api.rateLimit]}
                    detail={api.rateLimitInfo}
                />
                <InfoCard
                    icon={<Code className="h-5 w-5 text-blue-500" />}
                    label="Difficulty"
                    value={DIFFICULTY_LABELS[api.difficultyLevel]}
                />
                <InfoCard
                    icon={<DollarSign className="h-5 w-5 text-green-500" />}
                    label="Pricing"
                    value={PRICING_LABELS[api.pricingType]}
                    detail={api.pricingSummary}
                />
            </div>

            {/* Use Cases */}
            {useCases.length > 0 && (
                <div className="mb-8 rounded-2xl border bg-white p-6">
                    <h2 className="mb-4 text-lg font-semibold">Common Use Cases</h2>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                        {useCases.map((uc, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2 rounded-xl border bg-gray-50/50 px-4 py-3"
                            >
                                <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                <span className="text-sm">{uc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Trust Signals */}
            <div className="mb-8 rounded-2xl border bg-white p-6">
                <h2 className="mb-3 text-lg font-semibold">Community Feedback</h2>
                <FeedbackButtons apiId={api.id} feedbackCounts={api.feedbackCounts} />
            </div>

            {/* Reviews Section */}
            <div className="rounded-2xl border bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold">
                    Reviews{" "}
                    <span className="text-muted-foreground font-normal">
                        ({initialReviews.meta.total})
                    </span>
                </h2>

                {initialReviews.data.length > 0 ? (
                    <div className="space-y-4">
                        {initialReviews.data.map((review) => (
                            <div key={review.id} className="border-b pb-4 last:border-0">
                                <div className="mb-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-medium">
                                            {review.user.name?.[0] || "U"}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">
                                                {review.user.name || "Anonymous"}
                                            </p>
                                            <div className="flex items-center gap-0.5">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-3 w-3 ${i < review.rating
                                                            ? "fill-orange-400 text-orange-400"
                                                            : "text-gray-200"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                {review.comment && (
                                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-sm text-muted-foreground py-8">
                        No reviews yet. Be the first to review this API!
                    </p>
                )}

                {/* Review Form */}
                <div className="mt-6 border-t pt-6">
                    <ReviewForm apiId={api.id} />
                </div>
            </div>
        </div>
    );
}

function InfoCard({
    icon,
    label,
    value,
    detail,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    detail?: string;
}) {
    return (
        <div className="rounded-2xl border bg-white p-5">
            <div className="flex items-center gap-2 mb-2">
                {icon}
                <span className="text-sm text-muted-foreground">{label}</span>
            </div>
            <p className="font-semibold">{value}</p>
            {detail && (
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {detail}
                </p>
            )}
        </div>
    );
}

function formatNumber(n: number): string {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
}
