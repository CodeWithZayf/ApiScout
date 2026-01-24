"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-3">
      <div className="mx-auto max-w-6xl">
        <nav className="flex h-20 items-center justify-between gap-4 rounded-2xl border border-gray-200/60 bg-white/80 px-4 shadow-sm backdrop-blur-md">
          
          {/* Left: Hamburger (mobile) + Logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger Menu Button - Mobile Only */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100 lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-sm">
                <span className="text-lg font-bold text-white">A</span>
              </div>
              <span className="text-lg font-semibold tracking-tight text-gray-900">
                ApiScout
              </span>
            </Link>
          </div>

          {/* Center: Navigation Links - Desktop Only */}
          <div className="hidden items-center gap-1 lg:flex">
            <Link
              href="/apis"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
            >
              APIs
            </Link>
            <Link
              href="/categories"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
            >
              Categories
            </Link>
            <Link
              href="/compare"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
            >
              Compare
            </Link>
            <Link
              href="/submit"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
            >
              Submit API
            </Link>
          </div>

          {/* Right: Search + Actions */}
          <div className="flex items-center gap-2">
            {/* Search Bar */}
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/80 px-3 py-1.5 text-sm text-gray-500">
              <Search size={14} />
              <input
                placeholder="Search..."
                className="w-20 bg-transparent outline-none sm:w-32 md:w-40"
              />
            </div>

            {/* Auth - Desktop Only */}
            <Link href="/login" className="hidden lg:block">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                Sign in
              </Button>
            </Link>
            <Link href="/signup" className="hidden lg:block">
              <Button
                size="sm"
                className="rounded-xl bg-orange-500 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-600"
              >
                Get Started
                <span className="ml-1 text-orange-200">·</span>
                <span className="text-orange-200">It&apos;s Free</span>
              </Button>
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="mt-2 rounded-2xl border border-gray-200/60 bg-white/95 p-4 shadow-lg backdrop-blur-md lg:hidden">
            <div className="flex flex-col gap-1">
              <Link
                href="/apis"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                APIs
              </Link>
              <Link
                href="/categories"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Categories
              </Link>
              <Link
                href="/compare"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Compare
              </Link>
              <Link
                href="/submit"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Submit API
              </Link>

              {/* Divider */}
              <div className="my-2 h-px bg-gray-200" />

              {/* Auth Links */}
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-1"
              >
                <Button
                  size="sm"
                  className="w-46 rounded-xl bg-orange-500 py-3 text-sm font-medium text-white shadow-sm hover:bg-orange-600"
                >
                  Get Started · It&apos;s Free
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
