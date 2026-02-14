export default function Loading() {
    return (
        <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="animate-pulse space-y-6">
                {/* Header skeleton */}
                <div className="space-y-3">
                    <div className="h-8 w-64 rounded-lg bg-gray-200" />
                    <div className="h-4 w-96 rounded bg-gray-100" />
                </div>

                {/* Grid skeleton */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="rounded-2xl border bg-white p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-gray-200" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 w-24 rounded bg-gray-200" />
                                    <div className="h-3 w-16 rounded bg-gray-100" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-3 w-full rounded bg-gray-100" />
                                <div className="h-3 w-3/4 rounded bg-gray-100" />
                            </div>
                            <div className="flex gap-2">
                                <div className="h-5 w-12 rounded-full bg-gray-100" />
                                <div className="h-5 w-16 rounded-full bg-gray-100" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
