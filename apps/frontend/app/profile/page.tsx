"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Bookmark,
    Star,
    Settings,
    User,
    Mail,
    Lock,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ArrowRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { API_BASE_URL } from "@/lib/api";
import { ApiItem } from "@/lib/types";
import { PRICING_LABELS, PRICING_COLORS, AUTH_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/* ─── types ─────────────────────────────────────────────── */

interface BookmarkItem {
    id: string;
    createdAt: string;
    api: ApiItem;
}

interface BookmarkResponse {
    data: BookmarkItem[];
    meta: { total: number; page: number; limit: number; totalPages: number };
}

/* ─── main page ─────────────────────────────────────────── */

export default function ProfilePage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace("/login");
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl px-6 py-10">
            {/* Profile header */}
            <div className="mb-8 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-xl font-bold text-white shadow-sm">
                    {user.name?.[0] || user.email[0].toUpperCase()}
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {user.name || user.email.split("@")[0]}
                    </h1>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="saved" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="saved" className="gap-2">
                        <Bookmark className="h-4 w-4" />
                        Saved APIs
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="gap-2">
                        <Settings className="h-4 w-4" />
                        Settings
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="saved">
                    <SavedApisTab />
                </TabsContent>

                <TabsContent value="settings">
                    <SettingsTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}

/* ─── Saved APIs tab ────────────────────────────────────── */

function SavedApisTab() {
    const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
    const [meta, setMeta] = useState({ total: 0, page: 1, limit: 12, totalPages: 0 });
    const [loading, setLoading] = useState(true);

    const fetchBookmarks = useCallback(async (page: number) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/bookmarks?page=${page}&limit=12`, {
                credentials: "include",
            });
            if (res.ok) {
                const data: BookmarkResponse = await res.json();
                setBookmarks(data.data);
                setMeta(data.meta);
            }
        } catch {
            // Network error — keep empty state
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookmarks(1);
    }, [fetchBookmarks]);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
            </div>
        );
    }

    if (bookmarks.length === 0) {
        return (
            <div className="rounded-2xl border bg-gray-50/50 py-20 text-center">
                <Bookmark className="mx-auto mb-4 h-10 w-10 text-muted-foreground/40" />
                <p className="text-lg font-medium text-muted-foreground">No saved APIs yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                    Browse APIs and bookmark the ones you like
                </p>
                <Link href="/apis">
                    <Button className="mt-4 gap-2 rounded-xl" variant="outline">
                        Browse APIs <ArrowRight className="h-4 w-4" />
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div>
            <p className="mb-4 text-sm text-muted-foreground">
                {meta.total} saved API{meta.total !== 1 ? "s" : ""}
            </p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {bookmarks.map((b) => (
                    <SavedApiCard key={b.id} api={b.api} />
                ))}
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                    {meta.page > 1 && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl"
                            onClick={() => fetchBookmarks(meta.page - 1)}
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
                                    onClick={() => fetchBookmarks(pageNum)}
                                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition ${
                                        meta.page === pageNum
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
                            onClick={() => fetchBookmarks(meta.page + 1)}
                        >
                            Next
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

/* ─── Saved API Card (reuses the same design as ApisPageClient) ─ */

function SavedApiCard({ api }: { api: ApiItem }) {
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
                                <p className="text-xs text-muted-foreground">{api.providerName}</p>
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
                        className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                            PRICING_COLORS[api.pricingType]
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

/* ─── Settings tab ──────────────────────────────────────── */

function SettingsTab() {
    const { user, refreshProfile } = useAuth();
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setSaving(true);

        // Build payload — only send changed fields
        const payload: Record<string, string> = {};
        if (name !== (user?.name || "")) payload.name = name;
        if (email !== user?.email) payload.email = email;
        if (currentPassword) payload.currentPassword = currentPassword;
        if (newPassword) payload.newPassword = newPassword;

        if (Object.keys(payload).length === 0) {
            setMessage({ type: "error", text: "No changes to save" });
            setSaving(false);
            return;
        }

        // Require current password when changing email or password
        if ((payload.email || payload.newPassword) && !payload.currentPassword) {
            setMessage({ type: "error", text: "Current password is required to change email or password" });
            setSaving(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Failed to update profile");
            }

            await refreshProfile();
            setCurrentPassword("");
            setNewPassword("");
            setMessage({ type: "success", text: "Profile updated successfully" });
        } catch (err: any) {
            setMessage({ type: "error", text: err.message || "Something went wrong" });
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
            {/* Name */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User className="h-4 w-4" />
                    Name
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-xl border bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
            </div>

            {/* Email */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Mail className="h-4 w-4" />
                    Email
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full rounded-xl border bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
            </div>

            {/* Divider */}
            <div className="border-t pt-4">
                <p className="mb-4 text-sm text-muted-foreground">
                    To change your email or password, enter your current password first.
                </p>

                {/* Current Password */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Lock className="h-4 w-4" />
                        Current Password
                    </label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                </div>

                {/* New Password */}
                <div className="mt-4 space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Lock className="h-4 w-4" />
                        New Password
                    </label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                    <p className="text-xs text-muted-foreground">
                        Min 8 characters with uppercase, lowercase, and a digit
                    </p>
                </div>
            </div>

            {/* Feedback message */}
            {message && (
                <div
                    className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
                        message.type === "success"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                    }`}
                >
                    {message.type === "success" ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                    ) : (
                        <AlertCircle className="h-4 w-4 shrink-0" />
                    )}
                    {message.text}
                </div>
            )}

            {/* Submit */}
            <Button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-orange-500 px-6 text-white shadow-sm hover:bg-orange-600"
            >
                {saving ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving…
                    </>
                ) : (
                    "Save Changes"
                )}
            </Button>
        </form>
    );
}
