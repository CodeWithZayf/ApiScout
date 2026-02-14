import { Metadata } from "next";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { ApiItem, Category, PaginatedResponse } from "@/lib/types";
import { PRICING_LABELS, PRICING_COLORS } from "@/lib/constants";
import { Star, ArrowRight, Bookmark, Eye, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageProps {
    params: Promise<{ category: string }>;
}

const CATEGORY_META: Record<string, { title: string; description: string; heading: string }> = {
    "ai-ml": {
        title: "Best AI & Machine Learning APIs in 2026",
        description: "Compare the top AI APIs including OpenAI, Google Gemini, Anthropic Claude, and more. Find the best ML API for your project.",
        heading: "AI & Machine Learning",
    },
    payments: {
        title: "Best Payment APIs in 2026",
        description: "Compare Stripe, PayPal, Square, and other payment APIs. Find the best payment processing API for your app.",
        heading: "Payment Processing",
    },
    authentication: {
        title: "Best Authentication APIs in 2026",
        description: "Compare Auth0, Firebase Auth, Clerk, and other auth APIs. Find the best authentication solution for your app.",
        heading: "Authentication",
    },
    "email-messaging": {
        title: "Best Email & Messaging APIs in 2026",
        description: "Compare SendGrid, Mailgun, Twilio, and other messaging APIs. Find the best communication API for your project.",
        heading: "Email & Messaging",
    },
    "cloud-storage": {
        title: "Best Cloud Storage APIs in 2026",
        description: "Compare AWS S3, Google Cloud Storage, Cloudflare R2, and more. Find the best storage API for your project.",
        heading: "Cloud Storage",
    },
    "maps-geo": {
        title: "Best Maps & Geolocation APIs in 2026",
        description: "Compare Google Maps, Mapbox, HERE, and other mapping APIs. Find the best geo API for your app.",
        heading: "Maps & Geolocation",
    },
    communication: {
        title: "Best Communication APIs in 2026",
        description: "Compare Twilio, Vonage, Agora, and other communication APIs for voice, video, and messaging.",
        heading: "Communication",
    },
    devtools: {
        title: "Best Developer Tools APIs in 2026",
        description: "Compare GitHub, GitLab, Vercel, and other developer tool APIs. Boost your development workflow.",
        heading: "Developer Tools",
    },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { category } = await params;
    const meta = CATEGORY_META[category];
    if (!meta) return { title: "Best APIs | APIScout" };
    return {
        title: `${meta.title} | APIScout`,
        description: meta.description,
        openGraph: {
            title: meta.title,
            description: meta.description,
            type: "article",
        },
    };
}

export function generateStaticParams() {
    return Object.keys(CATEGORY_META).map((category) => ({ category }));
}

export default async function BestApisPage({ params }: PageProps) {
    const { category } = await params;
    const meta = CATEGORY_META[category];

    let apis: ApiItem[] = [];

    try {
        const res = await apiFetch<PaginatedResponse<ApiItem>>(
            `/apis?category=${category}&sort=rating&limit=10`
        );
        apis = res.data;
    } catch {
        // Graceful fallback
    }

    return (
        <div className="mx-auto max-w-4xl px-6 py-8">
            {/* SEO-rich header */}
            <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                <span>/</span>
                <Link href="/best-apis" className="hover:text-foreground transition-colors">Best APIs</Link>
                <span>/</span>
                <span className="text-foreground">{meta?.heading || category}</span>
            </nav>

            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <Crown className="h-6 w-6 text-orange-500" />
                    <span className="text-sm font-medium text-orange-600">Best APIs Guide</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">
                    {meta?.title || `Best ${category} APIs`}
                </h1>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                    {meta?.description || `Discover and compare the best ${category} APIs for your next project.`}
                </p>
            </div>

            {/* Quick comparison table */}
            {apis.length > 0 && (
                <div className="mb-8 overflow-hidden rounded-2xl border bg-white">
                    <div className="bg-gray-50 px-5 py-3 border-b">
                        <h2 className="text-sm font-semibold">Quick Comparison</h2>
                    </div>
                    <div className="divide-y">
                        {apis.map((api, i) => (
                            <Link key={api.id} href={`/api/${api.slug}`}>
                                <div className="flex items-center gap-4 px-5 py-4 transition hover:bg-gray-50/50 group">
                                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold shrink-0 ${i < 3 ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"
                                        }`}>
                                        {i + 1}
                                    </span>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 text-lg font-bold text-white shrink-0">
                                        {api.name[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium group-hover:text-orange-600 transition-colors">{api.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{api.description}</p>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-4 shrink-0">
                                        <div className="flex items-center gap-1 text-sm">
                                            <Star className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
                                            <span className="font-medium">{api.averageRating.toFixed(1)}</span>
                                        </div>
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${PRICING_COLORS[api.pricingType]}`}>
                                            {PRICING_LABELS[api.pricingType]}
                                        </span>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-orange-600 transition-colors" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* SEO text content */}
            <article className="prose prose-gray max-w-none">
                <h2>How to Choose the Right {meta?.heading || category} API</h2>
                <p>
                    When selecting an API for your project, consider these key factors:
                </p>
                <ul>
                    <li><strong>Pricing</strong> — Does the API offer a free tier? What are the costs at scale?</li>
                    <li><strong>Rate Limits</strong> — Can the API handle your expected traffic volume?</li>
                    <li><strong>Authentication</strong> — How easy is it to integrate? API Key vs OAuth vs Bearer Token.</li>
                    <li><strong>Documentation</strong> — Is the documentation comprehensive and up-to-date?</li>
                    <li><strong>Community & Support</strong> — How responsive is the provider? What does the community say?</li>
                </ul>
                <p>
                    Use our <Link href="/compare" className="text-orange-600 font-medium">comparison tool</Link> to
                    evaluate APIs side-by-side, or browse <Link href={`/categories/${category}`} className="text-orange-600 font-medium">all {meta?.heading || category} APIs</Link> to
                    find the perfect fit.
                </p>
            </article>

            <div className="mt-8 flex justify-center gap-3">
                <Link href={`/categories/${category}`}>
                    <Button className="rounded-xl bg-gray-900 text-white hover:bg-gray-800 gap-2">
                        View All {meta?.heading || category} APIs <ArrowRight className="h-4 w-4" />
                    </Button>
                </Link>
                <Link href="/compare">
                    <Button variant="outline" className="rounded-xl">
                        Compare APIs
                    </Button>
                </Link>
            </div>
        </div>
    );
}
