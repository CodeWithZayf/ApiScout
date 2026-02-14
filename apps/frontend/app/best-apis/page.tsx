import { Metadata } from "next";
import Link from "next/link";
import { Crown, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Best APIs for Developers in 2026 | APIScout",
    description: "Curated guides to the best APIs across categories — AI, Payments, Auth, Email, Cloud, Maps, and more. Updated for 2026.",
};

const GUIDES = [
    { slug: "ai-ml", title: "AI & Machine Learning", desc: "OpenAI, Gemini, Claude, Hugging Face", color: "from-pink-500 to-purple-500" },
    { slug: "payments", title: "Payment Processing", desc: "Stripe, PayPal, Square, Razorpay", color: "from-blue-500 to-cyan-500" },
    { slug: "authentication", title: "Authentication", desc: "Auth0, Firebase, Clerk, Supabase", color: "from-purple-500 to-indigo-500" },
    { slug: "email-messaging", title: "Email & Messaging", desc: "SendGrid, Mailgun, Twilio, Resend", color: "from-green-500 to-emerald-500" },
    { slug: "cloud-storage", title: "Cloud Storage", desc: "AWS S3, GCS, Cloudflare R2, Supabase", color: "from-orange-500 to-amber-500" },
    { slug: "maps-geo", title: "Maps & Geolocation", desc: "Google Maps, Mapbox, HERE, TomTom", color: "from-cyan-500 to-blue-500" },
    { slug: "communication", title: "Communication", desc: "Twilio, Vonage, Agora, Stream", color: "from-yellow-500 to-orange-500" },
    { slug: "devtools", title: "Developer Tools", desc: "GitHub, Vercel, Netlify, Railway", color: "from-gray-600 to-gray-800" },
];

export default function BestApisIndex() {
    return (
        <div className="mx-auto max-w-4xl px-6 py-8">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <Crown className="h-6 w-6 text-orange-500" />
                    <span className="text-sm font-medium text-orange-600">Curated Guides</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Best APIs for Developers in 2026
                </h1>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                    Expert-curated guides to help you pick the right API for every use case.
                    Each guide compares top providers on pricing, performance, ease of use, and community trust.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {GUIDES.map((guide) => (
                    <Link key={guide.slug} href={`/best-apis/${guide.slug}`}>
                        <div className="group rounded-2xl border bg-white p-6 transition hover:shadow-lg hover:border-orange-200">
                            <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${guide.color} text-white`}>
                                <Crown className="h-5 w-5" />
                            </div>
                            <h2 className="text-lg font-semibold group-hover:text-orange-600 transition-colors">
                                Best {guide.title} APIs
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">{guide.desc}</p>
                            <div className="mt-3 flex items-center gap-1 text-sm text-orange-600 font-medium">
                                Read Guide <ArrowRight className="h-3.5 w-3.5" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
