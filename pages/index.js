
import axios from "axios";
import "swiper/css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { SwiperSlides } from "../components/SwiperSlides";
import {
  FiArrowRight,
  FiPlay,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

export default function Home({
  trending,
  popularShows,
  popularMovies,
  actionMovies,
  crimeShows,
  romanceMovies,
}) {
  const [isMovie, setIsMovie] = useState(false);
  const router = useRouter();

  const featuredMovies = (trending?.results || [])
  .filter((item) => item.backdrop_path && item.overview)
  .slice(0, 5);

const [featuredIndex, setFeaturedIndex] = useState(0);

const featured = featuredMovies[featuredIndex] || null;

const nextFeatured = () => {
  setFeaturedIndex((current) =>
    (current + 1) % featuredMovies.length
  );
};

const previousFeatured = () => {
  setFeaturedIndex((current) =>
    (current - 1 + featuredMovies.length) % featuredMovies.length
  );
};

useEffect(() => {
  if (featuredMovies.length < 2) return;

  const interval = setInterval(() => {
    setFeaturedIndex((current) =>
      (current + 1) % featuredMovies.length
    );
  }, 7000);

  return () => clearInterval(interval);
}, [featuredMovies.length]);

  const featuredTitle = featured?.title || featured?.name;
  const featuredYear = (
    featured?.release_date ||
    featured?.first_air_date ||
    ""
  ).slice(0, 4);

  const openFeatured = () => {
    if (!featured) return;

    const type =
      featured.media_type === "tv" ? "shows" : "movies";

    router.push(`/${type}/${featured.id}`);
  };

  const sections = [
    {
      title: "Trending Now",
      subtitle: "What everyone is watching",
      data: trending,
    },
    {
      title: "Action Movies",
      subtitle: "Big thrills. Bigger adventures.",
      data: actionMovies,
    },
    {
      title: "Crime TV Shows",
      subtitle: "Mysteries worth unraveling",
      data: crimeShows,
    },
    {
      title: "Romance Movies",
      subtitle: "Stories that stay with you",
      data: romanceMovies,
    },
  ];

  const SectionHeading = ({ title, subtitle }) => (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
          {title}
        </h2>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
          {subtitle}
        </p>
      </div>
    </div>
  );

  return (
    <main className="w-full min-w-0 overflow-hidden px-4 pb-16 sm:px-6 lg:px-8">
      {featured && (
        <section className="relative mb-12 min-h-[380px] overflow-hidden rounded-2xl bg-[#171925] sm:min-h-[440px] lg:min-h-[510px]">
          {featured.backdrop_path && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${featured.backdrop_path})`,
              }}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-[#101116] via-[#101116]/85 to-[#101116]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101116]/80 via-transparent to-transparent" />

          <div className="relative z-10 flex min-h-[380px] max-w-2xl flex-col justify-end p-6 text-white sm:min-h-[440px] sm:p-10 lg:min-h-[510px] lg:p-14">
            <span className="mb-4 w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#D3C0FF] backdrop-blur-sm">
              Featured today
            </span>

            <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {featuredTitle}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-200">
              {featuredYear && <span>{featuredYear}</span>}

              {typeof featured.vote_average === "number" && (
                <span className="flex items-center gap-1.5">
                  <FiStar className="text-yellow-400" />
                  {featured.vote_average.toFixed(1)} / 10
                </span>
              )}

              <span className="rounded border border-white/30 px-2 py-0.5 text-xs">
                {featured.media_type === "tv" ? "TV Series" : "Movie"}
              </span>
            </div>

            <p className="mt-5 max-w-xl text-sm leading-7 text-gray-200 sm:text-base">
              {featured.overview.length > 220
                ? `${featured.overview.slice(0, 220)}...`
                : featured.overview}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={openFeatured}
                className="inline-flex items-center gap-2 rounded-lg bg-[#A78BFA] px-6 py-3 text-sm font-bold text-[#111018] transition hover:bg-[#C4B5FD]"
              >
                <FiPlay />
                View Details
              </button>

              <button
                type="button"
                onClick={() => router.push("/movies")}
                className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Explore Movies
                <FiArrowRight />
              </button>
            </div>
          </div>
          {featuredMovies.length > 1 && (
  <>
    <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 sm:bottom-8 sm:right-8">
      <button
        type="button"
        onClick={previousFeatured}
        aria-label="Previous featured title"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition hover:bg-[#A78BFA] hover:text-black"
      >
        <FiChevronLeft size={20} />
      </button>

      <button
        type="button"
        onClick={nextFeatured}
        aria-label="Next featured title"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition hover:bg-[#A78BFA] hover:text-black"
      >
        <FiChevronRight size={20} />
      </button>
    </div>

    <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2 sm:bottom-8 sm:left-10 lg:left-14">
      {featuredMovies.map((item, index) => (
        <button
          key={item.id}
          type="button"
          onClick={() => setFeaturedIndex(index)}
          aria-label={`Show featured title ${index + 1}`}
          aria-current={featuredIndex === index ? "true" : undefined}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            featuredIndex === index
              ? "w-8 bg-[#A78BFA]"
              : "w-2 bg-white/40 hover:bg-white/70"
          }`}
        />
      ))}
    </div>
  </>
)}
        </section>
      )}

      <div className="space-y-12 lg:space-y-16">
        <section>
          <SectionHeading
            title="Trending Now"
            subtitle="What everyone is watching"
          />
          <SwiperSlides data={trending} />
        </section>

        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                What&apos;s Popular
              </h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                Discover the audience favorites
              </p>
            </div>

            <div className="flex rounded-full border border-gray-300 bg-gray-100 p-1 dark:border-white/10 dark:bg-[#1D1F2B]">
              <button
                type="button"
                onClick={() => setIsMovie(false)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  !isMovie
                    ? "bg-[#A78BFA] text-[#111018]"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                TV Shows
              </button>

              <button
                type="button"
                onClick={() => setIsMovie(true)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  isMovie
                    ? "bg-[#A78BFA] text-[#111018]"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                Movies
              </button>
            </div>
          </div>

          <SwiperSlides
            data={isMovie ? popularMovies : popularShows}
          />
        </section>

        {sections.slice(1).map((section) => (
          <section key={section.title}>
            <SectionHeading
              title={section.title}
              subtitle={section.subtitle}
            />
            <SwiperSlides data={section.data} />
          </section>
        ))}
      </div>
    </main>
  );
}

export const getStaticProps = async () => {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing TMDB_API_KEY. Add it to your .env.local file."
    );
  }

  const base = "https://api.themoviedb.org/3";

  const getData = async (endpoint, params = {}) => {
    const { data } = await axios.get(`${base}${endpoint}`, {
      params: {
        api_key: apiKey,
        language: "en-US",
        ...params,
      },
    });

    return data;
  };

  const [
    trending,
    popularShows,
    popularMovies,
    actionMovies,
    crimeShows,
    romanceMovies,
  ] = await Promise.all([
    getData("/trending/all/day"),
    getData("/tv/popular", { page: 1 }),
    getData("/movie/popular", { page: 1 }),
    getData("/discover/movie", {
      sort_by: "popularity.desc",
      include_adult: false,
      page: 1,
      with_genres: 28,
    }),
    getData("/discover/tv", {
      sort_by: "popularity.desc",
      page: 1,
      with_genres: 80,
    }),
    getData("/discover/movie", {
      sort_by: "popularity.desc",
      include_adult: false,
      page: 1,
      with_genres: 10749,
    }),
  ]);

  return {
    props: {
      trending,
      popularShows,
      popularMovies,
      actionMovies,
      crimeShows,
      romanceMovies,
    },
    revalidate: 3600,
  };
};
