import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold">ApiScout</h3>
            <p className="text-sm text-muted-foreground">
              Discover the right API faster, without noise.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h4 className="font-semibold">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/categories" className="text-muted-foreground hover:text-foreground">Categories</Link></li>
              <li><Link href="/trending" className="text-muted-foreground hover:text-foreground">Trending</Link></li>
              <li><Link href="/compare" className="text-muted-foreground hover:text-foreground">Compare APIs</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/submit" className="text-muted-foreground hover:text-foreground">Submit API</Link></li>
              <li><Link href="/guides" className="text-muted-foreground hover:text-foreground">Guides</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link></li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="text-center text-sm text-muted-foreground">
          © 2026 ApiScout. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
