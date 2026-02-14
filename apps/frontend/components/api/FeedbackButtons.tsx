"use client";

import { useState } from "react";
import { ThumbsUp, AlertTriangle, Clock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { API_BASE_URL } from "@/lib/api";
import { FeedbackType } from "@/lib/types";

interface FeedbackButtonsProps {
    apiId: string;
    feedbackCounts?: Record<string, number>;
}

const feedbackOptions = [
    { type: "USEFUL" as FeedbackType, icon: ThumbsUp, label: "Useful", color: "text-green-600 bg-green-50 border-green-200 hover:bg-green-100" },
    { type: "OVERPRICED" as FeedbackType, icon: AlertTriangle, label: "Overpriced", color: "text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100" },
    { type: "OUTDATED" as FeedbackType, icon: Clock, label: "Outdated", color: "text-red-600 bg-red-50 border-red-200 hover:bg-red-100" },
];

export function FeedbackButtons({ apiId, feedbackCounts = {} }: FeedbackButtonsProps) {
    const { user, token } = useAuth();
    const [counts, setCounts] = useState(feedbackCounts);
    const [submitted, setSubmitted] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFeedback = async (type: FeedbackType) => {
        if (!user || !token || loading) return;

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/feedback`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ apiId, type }),
            });

            if (res.ok) {
                setSubmitted(type);
                setCounts((prev) => ({ ...prev, [type]: (prev[type] || 0) + 1 }));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            {feedbackOptions.map(({ type, icon: Icon, label, color }) => (
                <button
                    key={type}
                    onClick={() => handleFeedback(type)}
                    disabled={!user || loading || submitted !== null}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${submitted === type ? color : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                    {(counts[type] || 0) > 0 && (
                        <span className="ml-0.5 text-muted-foreground">{counts[type]}</span>
                    )}
                </button>
            ))}
        </div>
    );
}
