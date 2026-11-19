
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { useRouter } from "next/router";
import { FiStar } from "react-icons/fi";

import "swiper/css";
import "swiper/css/navigation";

export const SwiperSlides = ({ data, onClick }) => {
  const router = useRouter();

  const movies = data?.results || [];

  const navToDetail = (item) => {
    const isMovie =
      item.media_type === "movie" ||
      (item.media_type !== "tv" && Boolean(item.release_date));

    router.push(
      isMovie ? `/movies/${item.id}` : `/shows/${item.id}`
    );
  };

  return (
    <div className="w-full min-w-0 overflow-hidden">
      <Swiper
        modules={[Navigation]}
        navigation
        slidesPerView="auto"
        spaceBetween={16}
        breakpoints={{
          640: { spaceBetween: 18 },
          1024: { spaceBetween: 22 },
        }}
        className="w-full"
      >
        {movies.map((item) => {
          const title = item.title || item.name;
          const year = (
            item.release_date ||
            item.first_air_date ||
            ""
          ).slice(0, 4);

          return (
            <SwiperSlide
              key={item.id}
              className="!w-[145px] sm:!w-[175px] lg:!w-[195px]"
            >
              <button
                type="button"
                onClick={() => {
                  onClick?.(item);
                  navToDetail(item);
                }}
                className="group block w-full text-left"
              >
                <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-[#242633] shadow-lg">
                  {item.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      alt={title || "Movie poster"}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-4 text-center text-sm text-gray-400">
                      Poster unavailable
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {typeof item.vote_average === "number" && (
                    <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-xs font-semibold text-white">
                      <FiStar className="text-yellow-400" />
                      {item.vote_average.toFixed(1)}
                    </span>
                  )}
                </div>

                <h3 className="mt-3 truncate text-sm font-semibold text-gray-900 transition-colors group-hover:text-[#9473E8] dark:text-white">
                  {title}
                </h3>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {year || "Release date unavailable"}
                </p>
              </button>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};
