
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  FiHeart,
  FiBookmark,
  FiStar,
  FiClock,
  FiCalendar,
  FiGlobe,
  FiArrowLeft,
  FiUsers,
  FiPlay,
  FiX,
  FiArrowRight,
} from "react-icons/fi";

import actionsContext from "./ActionsContext";

const IMAGE_BASE = "https://image.tmdb.org/t/p/";

export default function ItemDetail({
  item,
  cast,
  recommendations = [],
}) {
  const router = useRouter();

  const {
    favs,
    watchlist,
    addToFavs,
    addToWatchlist,
    removeFromFavorites,
    removeFromWatchlist,
  } = useContext(actionsContext);

  const [trailerOpen, setTrailerOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setTrailerOpen(false);
    setNotice("");
  }, [item?.id]);

  useEffect(() => {
    if (!trailerOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setTrailerOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [trailerOpen]);

  if (!item) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        Title information is unavailable.
      </div>
    );
  }

  const isMovie = item.title !== undefined;
  const mediaType = isMovie ? "movie" : "tv";
  const mediaPath = isMovie ? "movies" : "shows";

  const title = item.title || item.name || "Untitled";
  const releaseDate =
    item.release_date || item.first_air_date;
  const year = releaseDate?.split("-")[0] || "N/A";

  const rating =
    typeof item.vote_average === "number"
      ? item.vote_average.toFixed(1)
      : "N/A";

  const runtime = item.runtime
    ? `${Math.floor(item.runtime / 60)}h ${item.runtime % 60}m`
    : item.number_of_seasons
    ? `${item.number_of_seasons} ${
        item.number_of_seasons === 1
          ? "season"
          : "seasons"
      }`
    : null;

  const genres = item.genres || [];
  const firstTenCast = (cast?.cast || []).slice(0, 10);

  const directors = (cast?.crew || []).filter(
    (person) => person.job === "Director"
  );

  const creators = isMovie
    ? directors
    : item.created_by?.length
    ? item.created_by
    : (cast?.crew || []).filter(
        (person) => person.job === "Executive Producer"
      );

  const productionCompanies =
    item.production_companies || [];

  const backdropUrl = item.backdrop_path
    ? `${IMAGE_BASE}original${item.backdrop_path}`
    : null;

  const posterUrl = item.poster_path
    ? `${IMAGE_BASE}w500${item.poster_path}`
    : null;

  const videos = item.videos?.results || [];

  const trailer =
    videos.find(
      (video) =>
        video.site === "YouTube" &&
        video.type === "Trailer" &&
        video.official
    ) ||
    videos.find(
      (video) =>
        video.site === "YouTube" &&
        video.type === "Trailer"
    ) ||
    videos.find(
      (video) =>
        video.site === "YouTube" &&
        video.type === "Teaser"
    );

  const suggestedTitles = recommendations
    .filter((suggestion) => suggestion.poster_path)
    .slice(0, 12);

  const sameTitle = (saved) => {
    const savedType =
      saved.media_type ||
      (saved.first_air_date || (saved.name && !saved.title)
        ? "tv"
        : "movie");

    return (
      String(saved.id) === String(item.id) &&
      savedType === mediaType
    );
  };

  const isFavorite = (favs?.favorites || []).some(
    sameTitle
  );

  const isWatchlisted = (
    watchlist?.watchlist || []
  ).some(sameTitle);

  const savedItem = {
    ...item,
    media_type: mediaType,
  };

  const handleFavorite = async () => {
    if (busy) return;
    setBusy(true);

    try {
      const success = isFavorite
        ? await removeFromFavorites(item.id)
        : await addToFavs(savedItem);

      if (success) {
        setNotice(
          isFavorite
            ? "Removed from favorites."
            : "Added to favorites!"
        );
      } else {
        setNotice("Couldn't update favorites.");
      }
    } catch {
      setNotice("Couldn't update favorites.");
    } finally {
      setBusy(false);
    }
  };

  const handleWatchlist = async () => {
    if (busy) return;
    setBusy(true);

    try {
      const success = isWatchlisted
        ? await removeFromWatchlist(item.id)
        : await addToWatchlist(savedItem);

      if (success) {
        setNotice(
          isWatchlisted
            ? "Removed from watchlist."
            : "Added to watchlist!"
        );
      } else {
        setNotice("Couldn't update watchlist.");
      }
    } catch {
      setNotice("Couldn't update watchlist.");
    } finally {
      setBusy(false);
    }
  };

  const openRecommendation = (id) => {
    router.push(`/${mediaPath}/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#F7F7FA] text-gray-900 dark:bg-[#101116] dark:text-white">
      {/* BACKDROP */}
      <div className="relative h-[300px] overflow-hidden sm:h-[380px] lg:h-[420px]">
        {backdropUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("${backdropUrl}")`,
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#31224B] to-[#101116]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#101116] via-[#101116]/55 to-black/20" />

        <button
          type="button"
          onClick={() => router.back()}
          className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-sm text-white backdrop-blur-md transition hover:bg-black/70 sm:left-8"
        >
          <FiArrowLeft />
          Back
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 mx-auto -mt-32 max-w-7xl px-5 pb-16 sm:px-8 lg:-mt-44 lg:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end lg:gap-12">
          <div className="mx-auto w-48 shrink-0 sm:w-56 md:mx-0 lg:w-64">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={`${title} poster`}
                className="aspect-[2/3] w-full rounded-2xl border border-white/20 object-cover shadow-2xl"
              />
            ) : (
              <div className="flex aspect-[2/3] items-center justify-center rounded-2xl bg-[#27232F] text-gray-400">
                No poster available
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 pb-2">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#C4B5FD]">
              {isMovie ? "Movie" : "TV Series"}
            </p>

            <h1 className="mb-5 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              {title}
            </h1>

            <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-gray-200">
              <span className="flex items-center gap-2">
                <FiCalendar className="text-[#C4B5FD]" />
                {year}
              </span>

              {runtime && (
                <span className="flex items-center gap-2">
                  <FiClock className="text-[#C4B5FD]" />
                  {runtime}
                </span>
              )}

              <span className="flex items-center gap-2">
                <FiGlobe className="text-[#C4B5FD]" />
                {item.original_language?.toUpperCase() ||
                  "N/A"}
              </span>

              <span className="flex items-center gap-2 font-semibold">
                <FiStar className="fill-yellow-400 text-yellow-400" />
                {rating}
                <span className="font-normal text-gray-300">
                  / 10
                </span>
              </span>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {genres.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {trailer && (
                <button
                  type="button"
                  onClick={() => setTrailerOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#171321] transition hover:bg-gray-200"
                >
                  <FiPlay size={18} />
                  Watch Trailer
                </button>
              )}

              <button
                type="button"
                disabled={busy}
                onClick={handleFavorite}
                className="flex items-center gap-2 rounded-xl bg-[#A78BFA] px-5 py-3 text-sm font-semibold text-[#171321] transition hover:bg-[#C4B5FD] disabled:opacity-60"
              >
                <FiHeart size={18} />
                {isFavorite
                  ? "Remove Favorite"
                  : "Add to Favorites"}
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={handleWatchlist}
                className="flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 disabled:opacity-60"
              >
                <FiBookmark size={18} />
                {isWatchlisted
                  ? "Remove from Watchlist"
                  : "Add to Watchlist"}
              </button>
            </div>
          </div>
        </div>

        {notice && (
          <div
            role="status"
            className="mt-6 rounded-xl border border-[#A78BFA]/30 bg-[#A78BFA]/10 px-4 py-3 text-sm dark:text-[#DDD6FE]"
          >
            {notice}
          </div>
        )}

        {/* STORYLINE AND DETAILS */}
        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(250px,1fr)]">
          <section>
            <h2 className="mb-5 text-2xl font-bold">
              Storyline
            </h2>

            <p className="max-w-3xl text-base leading-8 text-gray-600 dark:text-gray-300">
              {item.overview ||
                "No synopsis is available for this title."}
            </p>

            {item.tagline && (
              <p className="mt-5 border-l-2 border-[#A78BFA] pl-4 text-sm italic text-gray-500 dark:text-gray-400">
                {item.tagline}
              </p>
            )}
          </section>

          <aside className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-[#1D1F2B]">
            <h3 className="mb-5 text-lg font-semibold">
              Details
            </h3>

            <div className="space-y-5 text-sm">
              {creators.length > 0 && (
                <div>
                  <p className="mb-1 text-gray-500 dark:text-gray-400">
                    {isMovie ? "Director" : "Creator"}
                  </p>
                  <p className="font-medium">
                    {creators
                      .map((person) => person.name)
                      .join(", ")}
                  </p>
                </div>
              )}

              {productionCompanies.length > 0 && (
                <div>
                  <p className="mb-1 text-gray-500 dark:text-gray-400">
                    Production
                  </p>
                  <p className="font-medium">
                    {productionCompanies
                      .map((company) => company.name)
                      .join(", ")}
                  </p>
                </div>
              )}

              {releaseDate && (
                <div>
                  <p className="mb-1 text-gray-500 dark:text-gray-400">
                    Release date
                  </p>
                  <p className="font-medium">
                    {releaseDate}
                  </p>
                </div>
              )}

              {item.status && (
                <div>
                  <p className="mb-1 text-gray-500 dark:text-gray-400">
                    Status
                  </p>
                  <p className="font-medium">
                    {item.status}
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* CAST */}
        {firstTenCast.length > 0 && (
          <section className="mt-16">
            <div className="mb-7 flex items-center gap-3">
              <FiUsers
                className="text-[#A78BFA]"
                size={24}
              />
              <h2 className="text-2xl font-bold">
                Top Cast
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {firstTenCast.map((person) => (
                <div
                  key={
                    person.credit_id ||
                    person.cast_id ||
                    person.id
                  }
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[#1D1F2B]"
                >
                  {person.profile_path ? (
                    <img
                      src={`${IMAGE_BASE}w185${person.profile_path}`}
                      alt={person.name}
                      loading="lazy"
                      className="aspect-[3/4] w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[3/4] items-center justify-center bg-gray-100 text-gray-400 dark:bg-[#292B37]">
                      <FiUsers size={36} />
                    </div>
                  )}

                  <div className="p-3">
                    <p className="truncate text-sm font-semibold">
                      {person.name}
                    </p>
                    <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                      {person.character || "Cast member"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* RECOMMENDATIONS */}
        {suggestedTitles.length > 0 && (
          <section className="mt-16">
            <div className="mb-7 flex items-center justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#A78BFA]">
                  Keep Exploring
                </p>
                <h2 className="text-2xl font-bold">
                  You Might Also Like
                </h2>
              </div>
              <FiArrowRight
                size={22}
                className="text-[#A78BFA]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {suggestedTitles.map((suggestion) => {
                const suggestionTitle =
                  suggestion.title ||
                  suggestion.name ||
                  "Untitled";

                const suggestionYear = (
                  suggestion.release_date ||
                  suggestion.first_air_date ||
                  ""
                ).split("-")[0];

                return (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() =>
                      openRecommendation(suggestion.id)
                    }
                    className="group min-w-0 text-left"
                  >
                    <div className="relative overflow-hidden rounded-xl bg-gray-200 shadow-md dark:bg-[#1D1F2B]">
                      <img
                        src={`${IMAGE_BASE}w342${suggestion.poster_path}`}
                        alt={`${suggestionTitle} poster`}
                        loading="lazy"
                        className="aspect-[2/3] w-full object-cover transition duration-300 group-hover:scale-105"
                      />

                      <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-black/80 px-2 py-1 text-xs font-semibold text-white">
                        <FiStar className="fill-yellow-400 text-yellow-400" />
                        {typeof suggestion.vote_average ===
                        "number"
                          ? suggestion.vote_average.toFixed(1)
                          : "N/A"}
                      </div>
                    </div>

                    <p className="mt-3 truncate text-sm font-semibold transition group-hover:text-[#A78BFA]">
                      {suggestionTitle}
                    </p>

                    {suggestionYear && (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {suggestionYear}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* TRAILER POPUP */}
      {trailerOpen && trailer && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} trailer`}
          onClick={() => setTrailerOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setTrailerOpen(false)}
              aria-label="Close trailer"
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <FiX size={22} />
            </button>

            <div className="aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&rel=0`}
                title={`${title} trailer`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <p className="mt-4 text-center text-sm text-gray-300">
              {trailer.name ||
                `${title} — Official Trailer`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
