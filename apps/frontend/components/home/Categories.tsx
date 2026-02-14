import Link from "next/link";
import {
  CreditCard,
  Lock,
  Mail,
  Database,
  Sparkles,
  Globe,
  Phone,
  Code,
  Users,
  Cloud,
  BarChart,
  ShoppingCart,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Category } from "@/lib/types";

const ICON_MAP: Record<string, LucideIcon> = {
  "ai-ml": Sparkles,
  payments: CreditCard,
  authentication: Lock,
  "email-messaging": Mail,
  "cloud-storage": Database,
  "maps-geo": Globe,
  communication: Phone,
  devtools: Code,
  "social-media": Users,
  weather: Cloud,
  "data-analytics": BarChart,
  "e-commerce": ShoppingCart,
};

const COLOR_MAP: Record<string, string> = {
  "ai-ml": "bg-pink-100 text-pink-600",
  payments: "bg-blue-100 text-blue-600",
  authentication: "bg-purple-100 text-purple-600",
  "email-messaging": "bg-green-100 text-green-600",
  "cloud-storage": "bg-orange-100 text-orange-600",
  "maps-geo": "bg-cyan-100 text-cyan-600",
  communication: "bg-yellow-100 text-yellow-600",
  devtools: "bg-gray-100 text-gray-700",
  "social-media": "bg-indigo-100 text-indigo-600",
  weather: "bg-sky-100 text-sky-600",
  "data-analytics": "bg-emerald-100 text-emerald-600",
  "e-commerce": "bg-rose-100 text-rose-600",
};

export async function Categories() {
  let categories: Category[] = [];

  try {
    categories = await apiFetch<Category[]>("/categories");
  } catch {
    // Graceful fallback — show nothing
  }

  if (categories.length === 0) return null;

  // Show first 6 categories
  const displayed = categories.slice(0, 6);

  return (
    <section className="border-t bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Browse by Category</h2>
            <p className="mt-1 text-muted-foreground">
              Explore our most popular API collections.
            </p>
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {displayed.map((cat) => {
            const Icon = ICON_MAP[cat.slug] || Globe;
            const color = COLOR_MAP[cat.slug] || "bg-gray-100 text-gray-700";

            return (
              <Link
                key={cat.id}
                href={`/apis?category=${cat.slug}`}
                className="group cursor-pointer rounded-2xl border bg-background p-5 transition hover:shadow-md"
              >
                <div
                  className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="font-medium">{cat.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {cat.apiCount ?? 0} APIs
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
