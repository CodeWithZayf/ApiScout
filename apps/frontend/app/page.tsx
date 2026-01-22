import SearchBar from "@/components/search/SearchBar";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-20">
      {/* Hero Section */}
      <section className="text-center space-y-6">
<h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
  Discover the right API for your project
</h1>


        <p className="text-gray-600 max-w-2xl mx-auto">
          Search, compare, and review APIs across multiple categories.
          Built for developers who value clarity over clutter.
        </p>

        <div className="mt-8">
          <SearchBar />
        </div>
      </section>
    </main>
  );
}
