"use client";

import { useState } from "react";
import { Star, Send } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { API_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
    apiId: string;
    onReviewAdded?: () => void;
}

export function ReviewForm({ apiId, onReviewAdded }: ReviewFormProps) {
    const { user, token } = useAuth();
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    if (!user) {
        return (
            <div className="rounded-xl border border-dashed bg-gray-50/50 p-6 text-center">
                <p className="text-sm text-muted-foreground">
                    <button
                        onClick={() => router.push("/login")}
                        className="font-medium text-orange-600 hover:underline"
                    >
                        Sign in
                    </button>{" "}
                    to leave a review
                </p>
            </div>
        );
    }

    if (success) {
        return (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
                <p className="text-sm font-medium text-green-700">
                    Review submitted successfully! 🎉
                </p>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError("Please select a rating");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API_BASE_URL}/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ apiId, rating, comment: comment || undefined }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Failed to submit review");
            }

            setSuccess(true);
            onReviewAdded?.();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-xl border bg-gray-50/50 p-5">
            <h3 className="mb-3 text-sm font-semibold">Write a Review</h3>

            {error && (
                <p className="mb-3 text-sm text-red-600">{error}</p>
            )}

            {/* Star Rating */}
            <div className="mb-4 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        onMouseEnter={() => setHoverRating(i + 1)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(i + 1)}
                        className="p-0.5"
                    >
                        <Star
                            className={`h-6 w-6 transition ${(hoverRating || rating) > i
                                    ? "fill-orange-400 text-orange-400"
                                    : "text-gray-300"
                                }`}
                        />
                    </button>
                ))}
                {rating > 0 && (
                    <span className="ml-2 text-sm text-muted-foreground">
                        {rating}/5
                    </span>
                )}
            </div>

            {/* Comment */}
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this API (optional)..."
                rows={3}
                className="mb-3 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none transition"
            />

            <Button
                type="submit"
                disabled={loading || rating === 0}
                size="sm"
                className="rounded-xl bg-gray-900 text-white hover:bg-gray-800 gap-2 disabled:opacity-50"
            >
                <Send className="h-3.5 w-3.5" />
                {loading ? "Submitting..." : "Submit Review"}
            </Button>
        </form>
    );
}
