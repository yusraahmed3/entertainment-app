
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import actionsContext from "./ActionsContext";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w342";

export default function SavedCollection({ type }) {
  const router = useRouter();

  const {
    favs,
    watchlist,
    loading,
    removeFromFavorites,
    removeFromWatchlist,
  } = useContext(actionsContext);

  const [removingId, setRemovingId] = useState(null);

  const isFavorites = type === "favorites";

  const title = isFavorites
    ? "My Favorites"
    : "My Watchlist";

  const items = isFavorites
    ? favs?.favorites || []
    : watchlist?.watchlist || [];

  const removeItem = isFavorites
    ? removeFromFavorites
    : removeFromWatchlist;

  const getMediaType = (item) => {
    if (item.media_type === "tv") return "tv";
    if (item.media_type === "movie") return "movie";

    if (
      item.first_air_date ||
      (item.name && !item.title)
    ) {
      return "tv";
    }

    return "movie";
  };

  const openDetails = (item) => {
    router.push(
      getMediaType(item) === "tv"
        ? `/shows/${item.id}`
        : `/movies/${item.id}`
    );
  };

  const handleRemove = async (id) => {
    setRemovingId(id);

    try {
      await removeItem(id);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F7FA] px-4 pb-16 pt-6 text-gray-900 dark:bg-[#101116] dark:text-white sm:px-6 lg:px-8">
      <div className="mb-9">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8B5CF6] dark:text-[#A78BFA]">
          My Collection
        </p>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>

        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          {isFavorites
            ? "All the movies and shows you love, in one place."
            : "Your next movie night starts here."}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map(
            (_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[2/3] rounded-2xl bg-gray-200 dark:bg-[#292B37]" />
                <div className="mt-3 h-4 w-3/4 rounded bg-gray-200 dark:bg-[#292B37]" />
              </div>
            )
          )}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center dark:border-white/10 dark:bg-[#1D1F2B]">
          <div className="mb-4 text-5xl">
            {isFavorites ? "💜" : "🎬"}
          </div>

          <h2 className="text-xl font-semibold">
            {isFavorites
              ? "No favorites yet"
              : "Your watchlist is empty"}
          </h2>

          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            {isFavorites
              ? "Explore movies and shows to find something you love."
              : "Save titles you want to watch later."}
          </p>

          <button
            type="button"
            onClick={() => router.push("/movies")}
            className="mt-6 rounded-xl bg-[#A78BFA] px-6 py-3 text-sm font-semibold text-[#171321] hover:bg-[#C4B5FD]"
          >
            Explore Movies
          </button>
        </div>
      ) : (
        <>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            {items.length} saved{" "}
            {items.length === 1 ? "title" : "titles"}
          </p>

          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {[...items].reverse().map((item, index) => {
              const itemTitle =
                item.title || item.name || "Untitled";

              const mediaType = getMediaType(item);

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
                <div
                  key={`${mediaType}-${item.id}-${index}`}
                  className="group min-w-0"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-gray-200 shadow-sm transition group-hover:shadow-xl dark:bg-[#1D1F2B]">
                    <button
                      type="button"
                      onClick={() => openDetails(item)}
                      className="block w-full text-left"
                    >
                      {item.poster_path ? (
                        <img
                          src={`${IMAGE_BASE}${item.poster_path}`}
                          alt={`${itemTitle} poster`}
                          loading="lazy"
                          className="aspect-[2/3] w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex aspect-[2/3] items-center justify-center px-4 text-center text-sm text-gray-400">
                          No poster available
                        </div>
                      )}
                    </button>

                    <span className="pointer-events-none absolute left-3 top-3 rounded-lg bg-black/80 px-2 py-1 text-xs font-semibold text-white">
                      {mediaType === "tv"
                        ? "TV Series"
                        : "Movie"}
                    </span>

                    <span className="pointer-events-none absolute bottom-3 right-3 rounded-lg bg-black/80 px-2 py-1 text-xs font-semibold text-white">
                      <span className="text-yellow-400">
                        ★{" "}
                      </span>
                      {rating}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => openDetails(item)}
                    className="mt-3 block w-full truncate text-left text-sm font-semibold transition hover:text-[#8B5CF6]"
                  >
                    {itemTitle}
                  </button>

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {year}
                    </span>

                    <button
                      type="button"
                      disabled={removingId === item.id}
                      onClick={() => handleRemove(item.id)}
                      className="rounded-lg px-2 py-1 text-xs font-medium text-red-500 transition hover:bg-red-500/10 disabled:opacity-50"
                    >
                      {removingId === item.id
                        ? "Removing..."
                        : "Remove"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
