import axios from "axios";
import "swiper/css";
import { useState, useContext, useEffect } from "react";
import { SwiperSlides } from "../components/SwiperSlides";
import { Titles } from "../components/Titles";
import userContext from "../components/UserContext";
import { useRouter } from "next/router";

export default function Home({
  trending,
  popularShows,
  popularMovies,
  actionMovies,
  crimeShows,
  romanceMovies,
}) {
  const [isMovie, setIsMovie] = useState(false);
  const { isAuthenticated, getUserProfile } = useContext(userContext);
  const router = useRouter();

  useEffect(() => {
    isAuthenticated();
    getUserProfile();
  }, [router.pathname]);

  return (
    <div className="w-full h-full">
      <div className="w-full h-full text-dark dark:text-light flex flex-col space-y-16">
        <div>
          <Titles title="Trending Now" />
          <div className=" mt-5 ">
            <SwiperSlides data={trending} />
          </div>
        </div>
        <div className="">
          <div className="flex items-center space-x-3 w-full md:w-1/4">
            <Titles title="What's Popular" />
            <div className="space-x-8 ring-1 ring-gray-400 rounded-full w-36 flex overflow-hidden">
              <button
                onClick={() => setIsMovie(false)}
                className={`${
                  isMovie
                    ? "bg-transparent text-dark dark:text-light"
                    : "bg-customBlue dark:bg-gray-200 text-light dark:text-dark"
                }  w-full h-full rounded-full transition duration-300 `}
              >
                TV
              </button>
              <button
                onClick={() => setIsMovie(true)}
                className={`${
                  isMovie
                    ? "bg-customBlue dark:bg-gray-200 text-light dark:text-dark"
                    : "bg-transparent text-dark dark:text-light"
                } w-full h-full rounded-full transition duration-300 `}
              >
                Movie
              </button>
            </div>
          </div>

          <div className=" mt-5 ">
            {isMovie ? (
              <SwiperSlides data={popularMovies} />
            ) : (
              <SwiperSlides data={popularShows} />
            )}
          </div>
        </div>
        <div className="">
          <Titles title="Action Movies" />
          <div className="mt-5">
            <SwiperSlides data={actionMovies} />
          </div>
        </div>
        <div className="">
          <Titles title="Crime TV Shows" />
          <div className="mt-5">
            <SwiperSlides data={crimeShows} />
          </div>
        </div>
        <div className="">
          <Titles title="Romance Movies" />
          <div className="mt-5">
            <SwiperSlides data={romanceMovies} />
          </div>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps = async () => {
  const { data: trending } = await axios.get(
    "https://api.themoviedb.org/3/trending/all/day?api_key=d27a24aa42b8a15a34f92d9975a273e9"
  );

  const { data: popularShows } = await axios.get(
    "https://api.themoviedb.org/3/tv/popular?api_key=d27a24aa42b8a15a34f92d9975a273e9&language=en-US&page=1"
  );

  const { data: popularMovies } = await axios.get(
    "https://api.themoviedb.org/3/movie/popular?api_key=d27a24aa42b8a15a34f92d9975a273e9&language=en-US&page=1"
  );

  const { data: actionMovies } = await axios.get(
    "https://api.themoviedb.org/3/discover/movie?api_key=d27a24aa42b8a15a34f92d9975a273e9&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=false&page=1&with_genres=28&with_watch_monetization_types=flatrate"
  );

  const { data: crimeShows } = await axios.get(
    "https://api.themoviedb.org/3/discover/tv?api_key=d27a24aa42b8a15a34f92d9975a273e9&language=en-US&sort_by=popularity.desc&page=1&with_genres=80&include_null_first_air_dates=false&with_watch_monetization_types=flatrate&with_status=0&with_type=0"
  );

  const { data: romanceMovies } = await axios.get(
    "https://api.themoviedb.org/3/discover/movie?api_key=d27a24aa42b8a15a34f92d9975a273e9&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=10749&with_watch_monetization_types=flatrate"
  );

  return {
    props: {
      trending,
      popularShows,
      popularMovies,
      actionMovies,
      crimeShows,
      romanceMovies,
    },
  };
};
