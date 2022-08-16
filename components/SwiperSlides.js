import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";

import "swiper/css/navigation";

import { VoteCount } from "./VoteCount";
import { useRouter } from "next/router";
import { SliderImage } from "./SliderImage";

export const SwiperSlides = ({ data, onClick }) => {
  const router = useRouter();

  const navToDetail = (movie) => {
    movie.release_date
      ? router.push(`movies/${movie.id}`)
      : router.push(`shows/${movie.id}`);
  };

  return (
    <Swiper
      onClick={onClick}
      modules={[Navigation]}
      navigation
      slidesPerView="auto"
      spaceBetween={10}
      className="w-[28rem] md:w-[48rem] lg:w-[78rem] flex"
    >
      {data.results.map((item, i) => {
        return (
          <SwiperSlide
            onClick={() => navToDetail(item)}
            key={item.id}
            className="flex-1 cursor-pointer md:mx-2"
          >
            <SliderImage poster_path={item.poster_path} />
            <div className="text-gray-900 dark:text-gray-400 flex items-center justify-between text-xs pt-2">
              <p>
                {item?.release_date?.split("-")[0] ||
                  item?.first_air_date?.split("-")[0]}
              </p>
              <VoteCount vote={item.vote_average} />
              {item.media_type ? (
                <p className="w-10 border border-gray-400 text-center">
                  {item.media_type
                    ? item.media_type === "tv"
                      ? item.media_type.toUpperCase()
                      : item.media_type
                    : null}
                </p>
              ) : null}
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};
