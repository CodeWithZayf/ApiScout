export default function SearchBar() {
  return (
    <div className="mx-auto max-w-xl">
      <input
        type="text"
        placeholder="Search APIs by name, category, or use case..."
        className="
            w-full
            rounded-md
            border border-gray-300
            px-4
            py-3
            text-sm
            shadow-sm
            focus:outline-none
            focus:ring-2
            focus:ring-black
            "
      />
    </div>
  );
}
