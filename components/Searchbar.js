
import { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useRouter } from "next/router";

const Searchbar = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    const searchTerm = query.trim();

    if (!searchTerm) {
      router.push("/search");
      return;
    }

    router.push({
      pathname: "/search/[query]",
      query: { query: searchTerm },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="group relative w-full max-w-[560px]"
    >
      <FiSearch
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400 transition group-focus-within:text-[#A78BFA]"
      />

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies, TV shows..."
        aria-label="Search movies and TV shows"
        className="h-12 w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-20 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-[#A78BFA] focus:ring-2 focus:ring-[#A78BFA]/20 dark:border-white/10 dark:bg-[#1D1F2B] dark:text-white dark:focus:border-[#A78BFA]"
      />

      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="rounded-lg p-2 text-gray-400 transition hover:text-gray-900 dark:hover:text-white"
          >
            <FiX size={16} />
          </button>
        )}

        <button
          type="submit"
          aria-label="Submit search"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#A78BFA] text-[#171321] transition hover:bg-[#C4B5FD]"
        >
          <FiSearch size={16} />
        </button>
      </div>
    </form>
  );
};

export default Searchbar;
