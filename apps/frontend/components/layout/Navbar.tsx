"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-12 items-center justify-between gap-6">

          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500" />
            <span className="text-lg font-semibold tracking-tight">
              ApiScout
            </span>
          </Link>

          {/* Center: Search (Desktop only) */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search APIs…"
                className="pl-10 h-9 bg-muted/50 focus:bg-background transition"
              />
            </div>
          </div>

          {/* Right: Navigation */}
          <nav className="flex items-center gap-2">
            <Link href="/apis">
              <Button variant="ghost" size="sm">
                APIs
              </Button>
            </Link>

            <Link href="/categories">
              <Button variant="ghost" size="sm">
                Categories
              </Button>
            </Link>

            <Link href="/compare">
              <Button variant="ghost" size="sm">
                Compare
              </Button>
            </Link>

            {/* Contributor CTA */}
            <Link href="/submit">
              <Button variant="outline" size="sm">
                Submit API
              </Button>
            </Link>

            {/* Auth */}
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>

            <Link href="/signup">
              <Button size="sm">
                Sign up
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
