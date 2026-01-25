// components/home/Hero.tsx
"use client";

import { Search, ArrowRight, CheckCircle } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-4xl px-6 pt-28 pb-32 text-center">

        {/* Announcement */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          v1.0 is live · API comparison engine
        </div>

        {/* Heading */}
        <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl">
          The API Discovery Engine for Developers
        </h1>

        {/* Subheading */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Find, compare, and integrate the best APIs for your next project.
          Curated by engineers, for engineers — no marketing fluff.
        </p>

        {/* Search */}
        <div className="mx-auto mt-10 flex max-w-xl items-center rounded-2xl border bg-background shadow-sm">
          <div className="pl-4 text-muted-foreground">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Search payment, auth, email, or AI APIs..."
            className="flex-1 bg-transparent px-4 py-4 text-base outline-none"
          />
          <button className="m-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white hover:opacity-90">
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        {/* Trust points */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <CheckCircle className="h-4 w-4" /> Verified Specs
          </span>
          <span className="inline-flex items-center gap-2">
            <CheckCircle className="h-4 w-4" /> Real Performance Data
          </span>
          <span className="inline-flex items-center gap-2">
            <CheckCircle className="h-4 w-4" /> Community Reviews
          </span>
        </div>

      </div>
    </section>
  );
}
