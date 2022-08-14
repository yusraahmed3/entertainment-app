import axios from "axios";
import { useState } from "react";
import DiscoverMovies from "../../components/DiscoverMovies";
import { Titles } from "../../components/Titles";
const TVShows = ({ popular }) => {
  const [shows, setShows] = useState(popular.results);
  const [page, setPage] = useState(popular.page);

  const loadMore = async () => {
    setPage(++page);
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/tv/popular?api_key=d27a24aa42b8a15a34f92d9975a273e9&language=en-US&page=${page}`
    );
    setShows([...shows, ...data.results]);
  };
  return (
    <div className="w-full h-full text-dark dark:text-light ">
      <Titles title="Popular TV Shows" />
      <div className="flex flex-wrap justify-around w-full mt-5">
        {shows.map((show) => {
          return (
            <div key={show.id}>
              <DiscoverMovies movie={show} />
            </div>
          );
        })}
      </div>
      <button
        onClick={loadMore}
        className="w-full bg-customBlue rounded-md p-1 mt-3"
      >
        Load
      </button>
    </div>
  );
};

export default TVShows;

export const getStaticProps = async () => {
  const { data: popular } = await axios.get(
    "https://api.themoviedb.org/3/tv/popular?api_key=d27a24aa42b8a15a34f92d9975a273e9&language=en-US&page=1"
  );
  return {
    props: {
      popular,
    },
  };
};
