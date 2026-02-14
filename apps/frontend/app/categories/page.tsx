import { Metadata } from "next";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { Category } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/constants";
import {
    Sparkles, CreditCard, Lock, Mail, Database, Globe,
    Phone, Code, Users, Cloud, BarChart, ShoppingCart, ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
    title: "API Categories | APIScout",
    description: "Browse APIs by category. Find the best APIs for AI, Payments, Authentication, Email, and more.",
};

const iconMap: Record<string, React.ElementType> = {
    Sparkles, CreditCard, Lock, Mail, Database, Globe,
    Phone, Code, Users, Cloud, BarChart, ShoppingCart,
};

export default async function CategoriesPage() {
    let categories: Category[] = [];

    try {
        categories = await apiFetch<Category[]>("/categories");
    } catch (error) {
        console.error("Failed to fetch categories:", error);
    }

    return (
        <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">API Categories</h1>
                <p className="mt-2 text-muted-foreground">
                    Browse {categories.length} categories to find the right APIs
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => {
                    const Icon = iconMap[category.icon || "Code"] || Code;
                    const colorClass = CATEGORY_COLORS[category.slug] || "bg-gray-100 text-gray-700";

                    return (
                        <Link key={category.id} href={`/categories/${category.slug}`}>
                            <div className="group rounded-2xl border bg-white p-6 transition hover:shadow-lg hover:border-orange-200">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClass}`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-orange-600" />
                                </div>

                                <h2 className="mb-1 text-lg font-semibold group-hover:text-orange-600 transition-colors">
                                    {category.name}
                                </h2>
                                {category.description && (
                                    <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                                        {category.description}
                                    </p>
                                )}

                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-medium text-orange-600">
                                        {category.apiCount || 0}
                                    </span>
                                    <span className="text-sm text-muted-foreground">APIs</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
