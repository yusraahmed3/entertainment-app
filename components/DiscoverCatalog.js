
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w342";

export default function DiscoverCatalog({
  type,
  initialData,
  genres = [],
}) {
  const router = useRouter();
  const isMovie = type === "movie";

  const [selectedGenre, setSelectedGenre] = useState("");
  const [sort, setSort] = useState("popularity.desc");
  const [page, setPage] = useState(1);

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  const sortOptions = [
    { value: "popularity.desc", label: "Most Popular" },
    { value: "vote_average.desc", label: "Top Rated" },
    {
      value: isMovie
        ? "primary_release_date.desc"
        : "first_air_date.desc",
      label: "Newest First",
    },
    {
      value: isMovie
        ? "primary_release_date.asc"
        : "first_air_date.asc",
      label: "Oldest First",
    },
  ];

  useEffect(() => {
    const isDefault =
      page === 1 &&
      selectedGenre === "" &&
      sort === "popularity.desc" &&
      retry === 0;

    if (isDefault) {
      setData(initialData);
      setLoading(false);
      setError("");
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    async function fetchTitles() {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        type,
        page: String(page),
        sort,
      });

      if (selectedGenre) {
        params.set("genre", selectedGenre);
      }

      try {
        const response = await fetch(
          `/api/discover?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch titles");
        }

        const result = await response.json();

        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled && err.name !== "AbortError") {
          setError(
            "We couldn't load the titles. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchTitles();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [type, page, selectedGenre, sort, initialData, retry]);

  const changeGenre = (event) => {
    setSelectedGenre(event.target.value);
    setPage(1);
  };

  const changeSort = (event) => {
    setSort(event.target.value);
    setPage(1);
  };

  const resetFilters = () => {
    setSelectedGenre("");
    setSort("popularity.desc");
    setPage(1);
    setRetry(0);
  };

  const changePage = (nextPage) => {
    setPage(nextPage);

    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const openDetails = (id) => {
    router.push(
      isMovie ? `/movies/${id}` : `/shows/${id}`
    );
  };

  const results = data?.results || [];
  const totalPages = Math.min(data?.total_pages || 1, 500);

  const selectedGenreName =
    genres.find(
      (genre) => String(genre.id) === selectedGenre
    )?.name || "All Titles";

  return (
    <main className="min-h-screen bg-[#F7F7FA] px-4 pb-16 pt-6 text-gray-900 dark:bg-[#101116] dark:text-white sm:px-6 lg:px-8">

      {/* HEADER */}
      <div className="mb-9">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8B5CF6] dark:text-[#A78BFA]">
          Discover Entertainment
        </p>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Explore {isMovie ? "Movies" : "TV Shows"}
        </h1>

        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          {isMovie
            ? "From timeless classics to the latest blockbusters. Find your next favorite movie."
            : "Discover binge-worthy series, fan favorites, and unforgettable stories."}
        </p>
      </div>

      {/* FILTERS */}
      <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-[#1D1F2B]">

        <span className="mr-2 text-sm font-semibold">
          Filters
        </span>

        <select
          value={selectedGenre}
          onChange={changeGenre}
          aria-label="Filter by genre"
          className="min-w-[150px] flex-1 rounded-xl border border-gray-200 bg-[#F7F7FA] px-4 py-3 text-sm outline-none focus:border-[#A78BFA] dark:border-white/10 dark:bg-[#101116]"
        >
          <option value="">All Genres</option>

          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={changeSort}
          aria-label="Sort titles"
          className="min-w-[150px] flex-1 rounded-xl border border-gray-200 bg-[#F7F7FA] px-4 py-3 text-sm outline-none focus:border-[#A78BFA] dark:border-white/10 dark:bg-[#101116]"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {(selectedGenre ||
          sort !== "popularity.desc") && (
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-xl px-4 py-3 text-sm font-medium text-[#8B5CF6] hover:bg-[#A78BFA]/10"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* RESULTS HEADER */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">
          {selectedGenre ? selectedGenreName : "All Titles"}
        </h2>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          {loading
            ? "Loading..."
            : `${(data?.total_results || 0).toLocaleString()} titles`}
        </p>
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
            onClick={() => setRetry((value) => value + 1)}
            className="mt-2 font-semibold underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* LOADING STATE */}
      {loading ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-[2/3] rounded-2xl bg-gray-200 dark:bg-[#292B37]" />
              <div className="mt-3 h-4 w-3/4 rounded bg-gray-200 dark:bg-[#292B37]" />
              <div className="mt-2 h-3 w-1/3 rounded bg-gray-200 dark:bg-[#292B37]" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* TITLE CARDS */}
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

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => openDetails(item.id)}
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

          {results.length === 0 && !error && (
            <div className="py-20 text-center text-gray-500 dark:text-gray-400">
              No titles found for these filters.
            </div>
          )}
        </>
      )}

      {/* PAGINATION */}
      {!loading && !error && totalPages > 1 && (
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
    </main>
  );
}
