"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { API_BASE_URL } from "@/lib/api";
import { useRouter } from "next/navigation";

interface BookmarkButtonProps {
    apiId: string;
    initialBookmarked?: boolean;
    bookmarkCount: number;
    size?: "sm" | "md";
}

export function BookmarkButton({
    apiId,
    initialBookmarked = false,
    bookmarkCount,
    size = "md",
}: BookmarkButtonProps) {
    const { user, token } = useAuth();
    const router = useRouter();
    const [bookmarked, setBookmarked] = useState(initialBookmarked);
    const [count, setCount] = useState(bookmarkCount);
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        if (!user || !token) {
            router.push("/login");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/bookmarks/${apiId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                const data = await res.json();
                setBookmarked(data.bookmarked);
                setCount((prev) => (data.bookmarked ? prev + 1 : prev - 1));
            }
        } finally {
            setLoading(false);
        }
    };

    const isSmall = size === "sm";

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`inline-flex items-center gap-1.5 rounded-xl border transition disabled:opacity-50 ${bookmarked
                    ? "border-orange-200 bg-orange-50 text-orange-600"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                } ${isSmall ? "px-2.5 py-1.5 text-xs" : "px-3.5 py-2 text-sm"}`}
        >
            <Bookmark
                className={`${isSmall ? "h-3.5 w-3.5" : "h-4 w-4"} ${bookmarked ? "fill-current" : ""
                    }`}
            />
            <span className="font-medium">{bookmarked ? "Saved" : "Save"}</span>
            <span className="text-muted-foreground">{count}</span>
        </button>
    );
}
