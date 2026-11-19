
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w342";

export default function SearchResults({ initialQuery = "" }) {
  const router = useRouter();

  const [searchInput, setSearchInput] =
    useState(initialQuery);

  const [activeType, setActiveType] = useState("all");
  const [page, setPage] = useState(1);

  const [results, setResults] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    setSearchInput(initialQuery);
    setActiveType("all");
    setPage(1);
    setResults([]);
    setHasSearched(false);
  }, [initialQuery]);

  useEffect(() => {
    const query = initialQuery.trim();

    if (!query) {
      setResults([]);
      setTotalPages(1);
      setLoading(false);
      setHasSearched(false);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    async function fetchResults() {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        query,
        type: activeType,
        page: String(page),
      });

      try {
        const response = await fetch(
          `/api/search?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Search request failed.");
        }

        const data = await response.json();

        if (!cancelled) {
          setResults(data.results || []);
          setTotalPages(
            Math.min(data.total_pages || 1, 500)
          );
          setHasSearched(true);
        }
      } catch (err) {
        if (!cancelled && err.name !== "AbortError") {
          setError(
            "Something went wrong. Please try your search again."
          );
          setHasSearched(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchResults();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [initialQuery, activeType, page, retry]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const query = searchInput.trim();

    if (!query) return;

    setActiveType("all");
    setPage(1);

    if (query === initialQuery.trim()) {
      setRetry((value) => value + 1);
    } else {
      router.push(`/search/${encodeURIComponent(query)}`);
    }
  };

  const changeType = (type) => {
    setActiveType(type);
    setPage(1);
  };

  const changePage = (nextPage) => {
    setPage(nextPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openDetails = (item) => {
    const path =
      item.media_type === "tv" ? "shows" : "movies";

    router.push(`/${path}/${item.id}`);
  };

  const tabs = [
    { value: "all", label: "All Results" },
    { value: "movie", label: "Movies" },
    { value: "tv", label: "TV Shows" },
  ];

  return (
    <main className="min-h-screen bg-[#F7F7FA] px-4 pb-16 pt-6 text-gray-900 dark:bg-[#101116] dark:text-white sm:px-6 lg:px-8">

      {/* PAGE HEADER */}
      <div className="mb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8B5CF6] dark:text-[#A78BFA]">
          CineHub Search
        </p>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Find your next obsession.
        </h1>

        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Search movies and TV shows from around the world.
        </p>
      </div>

      {/* SEARCH INPUT */}
      <form
        onSubmit={handleSubmit}
        className="mb-7 flex flex-col gap-3 sm:flex-row"
      >
        <input
          type="search"
          value={searchInput}
          onChange={(event) =>
            setSearchInput(event.target.value)
          }
          placeholder="Search movies or TV shows..."
          aria-label="Search movies and TV shows"
          className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-5 py-4 text-sm outline-none transition focus:border-[#A78BFA] dark:border-white/10 dark:bg-[#1D1F2B]"
        />

        <button
          type="submit"
          className="rounded-xl bg-[#A78BFA] px-7 py-4 text-sm font-semibold text-[#171321] transition hover:bg-[#C4B5FD]"
        >
          Search
        </button>
      </form>

      {/* EMPTY SEARCH PAGE */}
      {!initialQuery.trim() && (
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center dark:border-white/10 dark:bg-[#1D1F2B]">
          <div className="mb-4 text-5xl">🎬</div>

          <h2 className="text-xl font-semibold">
            What are we watching today?
          </h2>

          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Enter a movie or TV show title to get started.
          </p>
        </div>
      )}

      {/* SEARCH RESULTS */}
      {initialQuery.trim() && (
        <>
          <div className="mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Search results for
              <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                &ldquo;{initialQuery}&rdquo;
              </span>
            </p>
          </div>

          {/* CATEGORY TABS */}
          <div className="mb-8 flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => changeType(tab.value)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  activeType === tab.value
                    ? "bg-[#A78BFA] text-[#171321]"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-[#A78BFA] dark:border-white/10 dark:bg-[#1D1F2B] dark:text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ERROR */}
          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
            >
              <p>{error}</p>

              <button
                type="button"
                onClick={() =>
                  setRetry((value) => value + 1)
                }
                className="mt-2 font-semibold underline"
              >
                Try Again
              </button>
            </div>
          )}

          {/* LOADING SKELETONS */}
          {loading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 10 }).map(
                (_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="aspect-[2/3] rounded-2xl bg-gray-200 dark:bg-[#292B37]" />
                    <div className="mt-3 h-4 w-3/4 rounded bg-gray-200 dark:bg-[#292B37]" />
                    <div className="mt-2 h-3 w-1/3 rounded bg-gray-200 dark:bg-[#292B37]" />
                  </div>
                )
              )}
            </div>
          ) : (
            <>
              {/* RESULT CARDS */}
              {!error && results.length > 0 && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {results.map((item) => {
                    const title =
                      item.title || item.name || "Untitled";

                    const releaseDate =
                      item.release_date ||
                      item.first_air_date ||
                      "";

                    const year =
                      releaseDate.split("-")[0] || "N/A";

                    const rating =
                      typeof item.vote_average === "number"
                        ? item.vote_average.toFixed(1)
                        : "N/A";

                    const isTV =
                      item.media_type === "tv";

                    return (
                      <button
                        key={`${item.media_type}-${item.id}`}
                        type="button"
                        onClick={() => openDetails(item)}
                        className="group min-w-0 text-left"
                      >
                        <div className="relative overflow-hidden rounded-2xl bg-gray-200 shadow-sm transition group-hover:shadow-xl dark:bg-[#1D1F2B]">

                          {item.poster_path ? (
                            <img
                              src={`${IMAGE_BASE}${item.poster_path}`}
                              alt={`${title} poster`}
                              loading="lazy"
                              className="aspect-[2/3] w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex aspect-[2/3] items-center justify-center px-4 text-center text-sm text-gray-400">
                              No poster available
                            </div>
                          )}

                          <span className="absolute left-3 top-3 rounded-lg bg-black/80 px-2 py-1 text-xs font-semibold text-white">
                            {isTV ? "TV Series" : "Movie"}
                          </span>

                          <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg bg-black/80 px-2 py-1 text-xs font-semibold text-white">
                            <span className="text-yellow-400">★</span>
                            {rating}
                          </span>
                        </div>

                        <h3 className="mt-3 truncate text-sm font-semibold transition group-hover:text-[#8B5CF6]">
                          {title}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {year}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* NO RESULTS */}
              {!error &&
                hasSearched &&
                results.length === 0 && (
                  <div className="rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center dark:border-white/10 dark:bg-[#1D1F2B]">
                    <div className="mb-4 text-5xl">🔎</div>

                    <h2 className="text-xl font-semibold">
                      No results found
                    </h2>

                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                      Try another title or switch between Movies and TV Shows.
                    </p>
                  </div>
                )}
            </>
          )}

          {/* PAGINATION */}
          {!loading &&
            !error &&
            results.length > 0 &&
            totalPages > 1 && (
              <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => changePage(page - 1)}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium transition hover:border-[#A78BFA] disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-[#1D1F2B]"
                >
                  ← Previous
                </button>

                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Page {page} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => changePage(page + 1)}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium transition hover:border-[#A78BFA] disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-[#1D1F2B]"
                >
                  Next →
                </button>
              </div>
            )}
        </>
      )}
    </main>
  );
}
