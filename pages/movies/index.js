import axios from "axios";
import DiscoverMovies from "../../components/DiscoverMovies";
import { useState, useContext } from "react";
import { Titles } from "../../components/Titles";
import { useRouter } from "next/router";
import userContext from "../../components/UserContext";

export default function Movies({ popular }) {
  const [movies, setMovies] = useState(popular.results);
  const [page, setPage] = useState(popular.page);

  const loadMore = async () => {
    setPage(++page);
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=d27a24aa42b8a15a34f92d9975a273e9&language=en-US&page=${page}`
    );
    setMovies([...movies, ...data.results]);
  };

  return (
    <div className="w-full h-full text-dark dark:text-light">
      <Titles title="Popular Movies" />
      <div className="flex flex-wrap w-full justify-evenly  mt-5">
        {movies.map((movie) => {
          return (
            <div key={movie.id}>
              <DiscoverMovies movie={movie} />
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
}

export const getStaticProps = async () => {
  const { data: popular } = await axios.get(
    "https://api.themoviedb.org/3/movie/popular?api_key=d27a24aa42b8a15a34f92d9975a273e9&language=en-US&page=1"
  );

  return {
    props: {
      popular,
    },
  };
};
