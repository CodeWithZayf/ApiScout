"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();

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
              href="/trending"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
            >
              Trending
            </Link>
            <Link
              href="/submit"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
            >
              Submit API
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {isLoading ? (
              <>
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
              </>
            ) : (
              <>
                {user ? (
                  <div className="hidden items-center gap-2 lg:flex">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-1.5 transition hover:bg-gray-200"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-xs font-bold text-white">
                        {user.name?.[0] || user.email[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {user.name || user.email.split("@")[0]}
                      </span>
                    </Link>
                    <button
                      onClick={logout}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
                      title="Sign out"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </>
            )}
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
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-xs font-bold text-white">
                      {user.name?.[0] || user.email[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{user.name || user.email}</span>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="rounded-lg px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
