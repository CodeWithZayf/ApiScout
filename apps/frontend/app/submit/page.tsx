"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, CheckCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { API_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SubmitPage() {
    const { user, token } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        websiteUrl: "",
        documentationUrl: "",
        description: "",
        categoryName: "",
        providerContact: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    if (!user) {
        return (
            <div className="mx-auto max-w-2xl px-6 py-20 text-center">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/25">
                    <Send className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-2xl font-bold">Submit an API</h1>
                <p className="mt-2 text-muted-foreground">
                    Sign in to submit APIs for listing on APIScout
                </p>
                <div className="mt-6 flex justify-center gap-3">
                    <Link href="/login">
                        <Button className="rounded-xl bg-gray-900 text-white hover:bg-gray-800">
                            Sign in
                        </Button>
                    </Link>
                    <Link href="/signup">
                        <Button variant="outline" className="rounded-xl">
                            Create account
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="mx-auto max-w-2xl px-6 py-20 text-center">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">
                    <CheckCircle className="h-7 w-7 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold">Submission Received!</h1>
                <p className="mt-2 text-muted-foreground">
                    Thanks for submitting! Our team will review your API and add it to the directory.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                    <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-xl">
                        Submit Another
                    </Button>
                    <Link href="/apis">
                        <Button className="rounded-xl bg-gray-900 text-white hover:bg-gray-800">
                            Browse APIs
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/submissions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Submission failed");
            }

            setSubmitted(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="mx-auto max-w-2xl px-6 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Submit an API</h1>
                <p className="mt-2 text-muted-foreground">
                    Know a great API that should be on APIScout? Submit it below and our team will review it.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div>
                    <label className="mb-1.5 block text-sm font-medium">API Name *</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        placeholder="e.g. Stripe, OpenAI, Twilio"
                        required
                        className="w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Website URL *</label>
                        <input
                            type="url"
                            value={formData.websiteUrl}
                            onChange={(e) => updateField("websiteUrl", e.target.value)}
                            placeholder="https://api-provider.com"
                            required
                            className="w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Documentation URL *</label>
                        <input
                            type="url"
                            value={formData.documentationUrl}
                            onChange={(e) => updateField("documentationUrl", e.target.value)}
                            placeholder="https://docs.api-provider.com"
                            required
                            className="w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium">Category *</label>
                    <input
                        type="text"
                        value={formData.categoryName}
                        onChange={(e) => updateField("categoryName", e.target.value)}
                        placeholder="e.g. Payments, AI, Authentication"
                        required
                        className="w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium">Description *</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        placeholder="What does this API do? Why should developers consider it?"
                        required
                        rows={4}
                        className="w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none transition"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium">
                        Provider Contact <span className="text-muted-foreground font-normal">(optional)</span>
                    </label>
                    <input
                        type="text"
                        value={formData.providerContact}
                        onChange={(e) => updateField("providerContact", e.target.value)}
                        placeholder="Email or Twitter handle"
                        className="w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                    />
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-gray-900 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 gap-2"
                    >
                        <Send className="h-4 w-4" />
                        {loading ? "Submitting..." : "Submit API for Review"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
