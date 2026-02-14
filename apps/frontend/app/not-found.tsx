import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-6">
            <div className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/25">
                    <span className="text-4xl font-bold text-white">?</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight">404</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Page not found
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                    <Link href="/">
                        <Button className="rounded-xl bg-gray-900 text-white hover:bg-gray-800">
                            Go Home
                        </Button>
                    </Link>
                    <Link href="/apis">
                        <Button variant="outline" className="rounded-xl">
                            Browse APIs
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
