"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { API_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
    Shield,
    LayoutDashboard,
    Layers,
    Tags,
    FileText,
    Check,
    X,
    Eye,
    Trash2,
} from "lucide-react";

type Tab = "submissions" | "apis" | "categories" | "tags";

interface Submission {
    id: string;
    name: string;
    websiteUrl: string;
    documentationUrl: string;
    description: string;
    categoryName: string;
    status: string;
    user: { name: string; email: string };
    createdAt: string;
}

export default function AdminPage() {
    const { user, token, isLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("submissions");
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isLoading && (!user || user.role !== "ADMIN")) {
            router.replace("/");
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        if (user?.role === "ADMIN" && token) {
            loadSubmissions();
        }
    }, [user, token]);

    const loadSubmissions = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/submissions`, {
                credentials: "include",
            });
            if (res.ok) {
                const data = await res.json();
                setSubmissions(Array.isArray(data) ? data : data.data || []);
            }
        } catch (e) {
            console.error("Failed to load submissions:", e);
        }
        setLoading(false);
    };

    const updateSubmission = async (id: string, status: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/submissions/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                setSubmissions((prev) =>
                    prev.map((s) => (s.id === id ? { ...s, status } : s))
                );
            }
        } catch (e) {
            console.error("Failed to update submission:", e);
        }
    };

    if (isLoading || !user || user.role !== "ADMIN") {
        return (
            <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
                <div className="text-center">
                    <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Admin access required</p>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: "submissions" as Tab, label: "Submissions", icon: FileText, count: submissions.filter((s) => s.status === "PENDING").length },
        { id: "apis" as Tab, label: "APIs", icon: Layers },
        { id: "categories" as Tab, label: "Categories", icon: LayoutDashboard },
        { id: "tags" as Tab, label: "Tags", icon: Tags },
    ];

    return (
        <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900">
                    <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
                    <p className="text-sm text-muted-foreground">Manage APIs, categories, tags, and submissions</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex items-center gap-1 rounded-xl border bg-gray-50 p-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${activeTab === tab.id
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                        {tab.count !== undefined && tab.count > 0 && (
                            <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs text-white">
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === "submissions" && (
                <div className="space-y-3">
                    {loading ? (
                        <div className="py-12 text-center text-sm text-muted-foreground">Loading...</div>
                    ) : submissions.length === 0 ? (
                        <div className="py-12 text-center text-sm text-muted-foreground">No submissions yet</div>
                    ) : (
                        submissions.map((sub) => (
                            <div key={sub.id} className="rounded-xl border bg-white p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold">{sub.name}</h3>
                                            <span
                                                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${sub.status === "PENDING"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : sub.status === "APPROVED"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {sub.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{sub.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span>Category: <strong>{sub.categoryName}</strong></span>
                                            <span>By: {sub.user?.name || sub.user?.email || "Unknown"}</span>
                                            <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="mt-2 flex items-center gap-2 text-xs">
                                            <a
                                                href={sub.websiteUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-orange-600 hover:underline"
                                            >
                                                Website ↗
                                            </a>
                                            <a
                                                href={sub.documentationUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-orange-600 hover:underline"
                                            >
                                                Docs ↗
                                            </a>
                                        </div>
                                    </div>

                                    {sub.status === "PENDING" && (
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Button
                                                onClick={() => updateSubmission(sub.id, "APPROVED")}
                                                size="sm"
                                                className="rounded-xl bg-green-600 text-white hover:bg-green-700 gap-1"
                                            >
                                                <Check className="h-3.5 w-3.5" /> Approve
                                            </Button>
                                            <Button
                                                onClick={() => updateSubmission(sub.id, "REJECTED")}
                                                size="sm"
                                                variant="outline"
                                                className="rounded-xl text-red-600 border-red-200 hover:bg-red-50 gap-1"
                                            >
                                                <X className="h-3.5 w-3.5" /> Reject
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === "apis" && (
                <div className="rounded-xl border bg-white p-8 text-center">
                    <Layers className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                    <h3 className="font-semibold">API Management</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Create, edit, and manage API listings via the backend API endpoints.
                    </p>
                    <p className="text-xs text-muted-foreground mt-3">
                        POST /api/apis · PATCH /api/apis/:id · DELETE /api/apis/:id
                    </p>
                </div>
            )}

            {activeTab === "categories" && (
                <div className="rounded-xl border bg-white p-8 text-center">
                    <LayoutDashboard className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                    <h3 className="font-semibold">Category Management</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Create and manage categories via the backend API endpoints.
                    </p>
                    <p className="text-xs text-muted-foreground mt-3">
                        POST /api/categories · PATCH /api/categories/:id · DELETE /api/categories/:id
                    </p>
                </div>
            )}

            {activeTab === "tags" && (
                <div className="rounded-xl border bg-white p-8 text-center">
                    <Tags className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                    <h3 className="font-semibold">Tag Management</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Create and manage tags via the backend API endpoints.
                    </p>
                    <p className="text-xs text-muted-foreground mt-3">
                        POST /api/tags · DELETE /api/tags/:id
                    </p>
                </div>
            )}
        </div>
    );
}
