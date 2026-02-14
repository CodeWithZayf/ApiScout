// components/home/ComparePreview.tsx
import Link from "next/link";
import { Check } from "lucide-react";

export function ComparePreview() {
  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-24">

        <div className="grid gap-16 lg:grid-cols-2 items-center">

          {/* LEFT CONTENT */}
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm">
              ⚖️ Compare Mode
            </span>

            <h2 className="mt-4 text-4xl font-bold leading-tight">
              Stop guessing.
              <br />
              <span className="text-white/80">Start comparing.</span>
            </h2>

            <p className="mt-4 max-w-xl text-white/70">
              Don&apos;t open 50 tabs to find the right tool. Compare rate limits,
              pricing tiers, authentication methods, and latency side-by-side.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                "Side-by-side technical specs",
                "Normalized pricing calculator",
                "Real-world latency benchmarks",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                    <Check className="h-4 w-4 text-white" />
                  </span>
                  <span className="text-white/90">{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/compare" className="mt-10 inline-block rounded-lg bg-white px-6 py-3 font-medium text-black hover:bg-white/90">
              Try Comparison Tool
            </Link>
          </div>

          {/* RIGHT TABLE */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">

            <div className="grid grid-cols-3 border-b border-white/10 pb-4 text-sm text-white/60">
              <div>Feature</div>
              <div className="text-white font-medium">Stripe</div>
              <div className="text-white font-medium">PayPal</div>
            </div>

            {[
              ["Transaction Fee", "2.9% + 30¢", "3.49% + 49¢"],
              ["Auth Method", "Bearer Token", "OAuth 2.0"],
              ["SDK Support", "7 Languages", "5 Languages"],
              ["Uptime SLA", "99.99%", "99.95%"],
            ].map(([label, stripe, paypal]) => (
              <div
                key={label}
                className="grid grid-cols-3 border-b border-white/5 py-4 text-sm"
              >
                <div className="text-white/60">{label}</div>
                <div className="text-green-400">{stripe}</div>
                <div className="text-white">{paypal}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
