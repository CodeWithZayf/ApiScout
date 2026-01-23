import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "ApiScout - Discover & Compare APIs for Developers",
    template: "%s | ApiScout"
  },
  description: "Discover, compare, review, and bookmark APIs across multiple categories. Find the right API faster, without noise.",
  keywords: ["API", "developer tools", "API discovery", "API comparison", "developer platform"],
  authors: [{ name: "ApiScout" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://apiscout.com",
    title: "ApiScout - Discover & Compare APIs",
    description: "Find the right API faster, without noise.",
    siteName: "ApiScout",
  },
  twitter: {
    card: "summary_large_image",
    title: "ApiScout - Discover & Compare APIs",
    description: "Find the right API faster, without noise.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
