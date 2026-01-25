import { Star, Bookmark } from "lucide-react";

const apis = [
  {
    name: "Stripe API",
    company: "Stripe, Inc.",
    description:
      "Financial infrastructure platform for the internet. Accept payments, send payouts, and manage businesses online.",
    category: "Payments",
    pricing: "Freemium",
    rating: 4.9,
    protocol: "REST",
    uptime: "99.99%",
  },
  {
    name: "GitHub API",
    company: "GitHub",
    description:
      "Create integrations, retrieve data, and automate your workflows with the world's leading software development platform.",
    category: "DevTools",
    pricing: "Free",
    rating: 4.8,
    protocol: "REST / GraphQL",
    uptime: "99.95%",
  },
  {
    name: "Twilio",
    company: "Twilio",
    description:
      "Connect with customers everywhere they want to interact. SMS, Voice, Video, and Email APIs for every platform.",
    category: "Communication",
    pricing: "Paid",
    rating: 4.7,
    protocol: "REST",
    uptime: "99.99%",
  },
];

export function Trending() {
  return (
    <section className="border-t bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20">

        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Trending this week</h2>

          <div className="flex items-center gap-2 text-sm">
            <button className="rounded-full bg-black px-4 py-1.5 text-white">
              All
            </button>
            <button className="rounded-full px-4 py-1.5 text-muted-foreground hover:bg-muted">
              Free
            </button>
            <button className="rounded-full px-4 py-1.5 text-muted-foreground hover:bg-muted">
              Paid
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apis.map((api) => (
            <div
              key={api.name}
              className="rounded-2xl border bg-background p-6 transition hover:shadow-md"
            >
              {/* Top row */}
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{api.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    By {api.company}
                  </p>
                </div>
                <Bookmark className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
              </div>

              {/* Description */}
              <p className="mb-4 text-sm text-muted-foreground">
                {api.description}
              </p>

              {/* Tags */}
              <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-md bg-muted px-2 py-1">
                  {api.category}
                </span>

                <span
                  className={`rounded-md px-2 py-1 ${
                    api.pricing === "Paid"
                      ? "bg-blue-100 text-blue-600"
                      : api.pricing === "Freemium"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {api.pricing}
                </span>

                <span className="flex items-center gap-1 font-medium">
                  <Star className="h-4 w-4 text-orange-400 fill-orange-400" />
                  {api.rating}
                </span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t pt-4 text-sm">
                <span className="text-muted-foreground">
                  {api.protocol} • {api.uptime} uptime
                </span>
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Details →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
