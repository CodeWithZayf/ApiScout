"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-6">
            <div className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-100">
                    <span className="text-4xl">⚠️</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    An unexpected error occurred. Please try again.
                </p>
                <div className="mt-6">
                    <Button
                        onClick={reset}
                        className="rounded-xl bg-gray-900 text-white hover:bg-gray-800"
                    >
                        Try again
                    </Button>
                </div>
            </div>
        </div>
    );
}
