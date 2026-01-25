// components/home/StackPreview.tsx
export function StackPreview() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-24 text-center">

        {/* Heading */}
        <h2 className="text-3xl font-semibold">
          Your personal API stack
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Bookmark APIs, track updates, and manage your integrations in one dashboard.
        </p>

        {/* Mock Window */}
        <div className="mt-16 rounded-2xl border bg-white shadow-sm">

          {/* Window chrome */}
          <div className="flex items-center gap-2 border-b px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-yellow-400" />
            <span className="h-3 w-3 rounded-full bg-green-400" />
          </div>

          {/* Content */}
          <div className="grid gap-8 p-8 md:grid-cols-3 text-left">

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-medium">
                  JD
                </div>
                <div>
                  <div className="font-medium">John Dev</div>
                  <div className="text-sm text-muted-foreground">Free Plan</div>
                </div>
              </div>

              <nav className="space-y-2 text-sm">
                <div className="rounded-md bg-muted px-3 py-2 font-medium">
                  Saved APIs <span className="text-muted-foreground">12</span>
                </div>
                <div className="px-3 py-2 text-muted-foreground">Reviews</div>
                <div className="px-3 py-2 text-muted-foreground">History</div>
              </nav>
            </div>

            {/* Main */}
            <div className="md:col-span-2">
              <div className="mb-4 text-sm font-medium text-muted-foreground">
                RECENTLY SAVED
              </div>

              <div className="space-y-3">
                {/* Item */}
                <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-black text-white font-bold">
                      V
                    </div>
                    <span className="font-medium">Vercel API</span>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    ACTIVE
                  </span>
                </div>

                {/* Item */}
                <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-600 text-white font-bold">
                      O
                    </div>
                    <span className="font-medium">OpenAI</span>
                  </div>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    EVALUATING
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
