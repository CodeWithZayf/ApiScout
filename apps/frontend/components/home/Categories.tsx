import { CreditCard, Lock, Mail, Database, Sparkles, Globe, ArrowRight } from "lucide-react";

const categories = [
  { name: "Payments", count: 142, icon: CreditCard, color: "bg-blue-100 text-blue-600" },
  { name: "Auth", count: 89, icon: Lock, color: "bg-purple-100 text-purple-600" },
  { name: "Email", count: 56, icon: Mail, color: "bg-green-100 text-green-600" },
  { name: "Storage", count: 204, icon: Database, color: "bg-orange-100 text-orange-600" },
  { name: "AI / ML", count: 315, icon: Sparkles, color: "bg-pink-100 text-pink-600" },
  { name: "Geo", count: 78, icon: Globe, color: "bg-gray-100 text-gray-700" },
];

export function Categories() {
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

          <a
            href="/categories"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
          >
            View all <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="group cursor-pointer rounded-2xl border bg-background p-5 transition hover:shadow-md"
            >
              <div
                className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${cat.color}`}
              >
                <cat.icon className="h-5 w-5" />
              </div>

              <h3 className="font-medium">{cat.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {cat.count} APIs
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
