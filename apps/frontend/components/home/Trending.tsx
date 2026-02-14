import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { ApiItem } from "@/lib/types";
import { PRICING_LABELS, PRICING_COLORS } from "@/lib/constants";

export async function Trending() {
  let apis: ApiItem[] = [];

  try {
    apis = await apiFetch<ApiItem[]>("/apis/trending?limit=6");
  } catch {
    // Graceful fallback
  }

  if (apis.length === 0) return null;

  return (
    <section className="border-t bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Trending this week</h2>
          <Link
            href="/trending"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apis.map((api) => (
            <Link
              key={api.id}
              href={`/api/${api.slug}`}
              className="rounded-2xl border bg-background p-6 transition hover:shadow-md block"
            >
              {/* Top row */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 text-lg font-bold text-white">
                    {api.name[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{api.name}</h3>
                    {api.providerName && (
                      <p className="text-sm text-muted-foreground">
                        By {api.providerName}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                {api.description}
              </p>

              {/* Tags */}
              <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-md bg-muted px-2 py-1">
                  {api.category.name}
                </span>
                <span
                  className={`rounded-md px-2 py-1 ${PRICING_COLORS[api.pricingType]}`}
                >
                  {PRICING_LABELS[api.pricingType]}
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Star className="h-4 w-4 text-orange-400 fill-orange-400" />
                  {api.averageRating.toFixed(1)}
                </span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t pt-4 text-sm">
                <span className="text-muted-foreground">
                  {api.viewCount.toLocaleString()} views
                </span>
                <span className="font-medium text-blue-600">
                  Details →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
