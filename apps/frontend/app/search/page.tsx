import { Metadata } from "next";
import { redirect } from "next/navigation";

interface PageProps {
    searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const params = await searchParams;
    return {
        title: params.q ? `Search: ${params.q} | APIScout` : "Search APIs | APIScout",
        description: "Search for the best APIs for your project.",
    };
}

export default async function SearchPage({ searchParams }: PageProps) {
    const params = await searchParams;

    // Redirect to /apis with search query
    if (params.q) {
        redirect(`/apis?search=${encodeURIComponent(params.q)}`);
    }

    redirect("/apis");
}
