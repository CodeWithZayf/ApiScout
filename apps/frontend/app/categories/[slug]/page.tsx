import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { ApiItem, Category, PaginatedResponse } from "@/lib/types";
import { ApisPageClient } from "@/app/apis/ApisPageClient";

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string; sort?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    try {
        const categories = await apiFetch<Category[]>("/categories");
        const category = categories.find((c) => c.slug === slug);
        if (!category) return { title: "Category Not Found" };
        return {
            title: `${category.name} APIs | APIScout`,
            description: category.description || `Browse the best ${category.name} APIs.`,
        };
    } catch {
        return { title: "Category | APIScout" };
    }
}

export default async function CategoryDetailPage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const sp = await searchParams;

    const query = new URLSearchParams();
    query.set("category", slug);
    query.set("limit", "12");
    if (sp.sort) query.set("sort", sp.sort);
    if (sp.page) query.set("page", sp.page);

    let apisData: PaginatedResponse<ApiItem> = {
        data: [],
        meta: { total: 0, page: 1, limit: 12, totalPages: 0 },
    };
    let categories: Category[] = [];
    let tags: any[] = [];

    try {
        [apisData, categories, tags] = await Promise.all([
            apiFetch<PaginatedResponse<ApiItem>>(`/apis?${query.toString()}`),
            apiFetch<Category[]>("/categories"),
            apiFetch<any[]>("/tags"),
        ]);
    } catch {
        notFound();
    }

    const category = categories.find((c) => c.slug === slug);
    if (!category) notFound();

    return (
        <div>
            {/* Category Header */}
            <div className="border-b bg-gray-50/50 px-6 py-8">
                <div className="mx-auto max-w-7xl">
                    <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/categories" className="hover:text-foreground transition-colors">
                            Categories
                        </Link>
                        <span>/</span>
                        <span className="text-foreground">{category.name}</span>
                    </nav>
                    <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
                    {category.description && (
                        <p className="mt-2 text-muted-foreground">{category.description}</p>
                    )}
                    <p className="mt-1 text-sm text-orange-600 font-medium">
                        {apisData.meta.total} APIs
                    </p>
                </div>
            </div>

            {/* Reuse ApisPageClient */}
            <ApisPageClient
                apis={apisData.data}
                categories={categories}
                tags={tags}
                meta={apisData.meta}
                currentFilters={{
                    category: slug,
                    sort: sp.sort,
                    page: sp.page ? parseInt(sp.page) : 1,
                }}
            />
        </div>
    );
}
