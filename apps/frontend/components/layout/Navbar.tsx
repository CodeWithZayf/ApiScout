export default function Navbar() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <span className="text-lg font-semibold tracking-tight">
          ApiScout
        </span>

        <nav className="flex items-center gap-6 text-sm text-gray-600">
          <a
            href="/apis"
            className="hover:text-black transition-colors"
          >
            APIs
          </a>
          <a
            href="/compare"
            className="hover:text-black transition-colors"
          >
            Compare
          </a>
          <a
            href="/login"
            className="text-black font-medium hover:underline"
          >
            Login
          </a>
        </nav>
      </div>
    </header>
  );
}
