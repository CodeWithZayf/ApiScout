// components/layout/Footer.tsx
import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16">

        {/* Top */}
        <div className="grid gap-12 md:grid-cols-4">

          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2 font-semibold">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-black text-white">
                A
              </div>
              ApiScout
            </div>

            <p className="text-sm text-muted-foreground">
              The definitive registry for public APIs. Helping developers build
              better software, faster.
            </p>

            <div className="mt-4 flex gap-4 text-muted-foreground">
              <a href="#" className="hover:text-foreground">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-foreground">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/apis">Browse</Link></li>
              <li><Link href="/categories">Categories</Link></li>
              <li><Link href="/trending">Trending</Link></li>
              <li><Link href="/compare">Comparisons</Link></li>
              <li><Link href="/best-apis">Best APIs Guide</Link></li>
              <li><Link href="/submit">Submit API</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/docs">Documentation</Link></li>
              <li><Link href="/standards">API Standards</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/community">Community</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/legal">Legal</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t pt-6 text-sm text-muted-foreground md:flex-row">

          <span>© {new Date().getFullYear()} ApiScout. All rights reserved.</span>

          <span className="rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white">
            Made With ❤️ By ApiScout
          </span>

          <span className="text-xs">Powered by ApiScout</span>
        </div>
      </div>
    </footer>
  );
}
