import { Metadata } from "next";
import { notFound } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { ApiDetail, PaginatedResponse, Review } from "@/lib/types";
import { ApiDetailClient } from "./ApiDetailClient";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    try {
        const api = await apiFetch<ApiDetail>(`/apis/${slug}`);
        return {
            title: `${api.name} API | APIScout`,
            description: api.description?.slice(0, 160),
        };
    } catch {
        return { title: "API Not Found" };
    }
}

export default async function ApiDetailPage({ params }: PageProps) {
    const { slug } = await params;

    let api: ApiDetail | null = null;

    try {
        api = await apiFetch<ApiDetail>(`/apis/${slug}`);
    } catch {
        notFound();
    }

    if (!api) notFound();

    // The backend /apis/:slug endpoint already returns reviews embedded
    const reviews: PaginatedResponse<Review> = {
        data: api.reviews || [],
        meta: {
            total: api.reviews?.length || 0,
            page: 1,
            limit: 10,
            totalPages: 1,
        },
    };

    return <ApiDetailClient api={api} initialReviews={reviews} />;
}
