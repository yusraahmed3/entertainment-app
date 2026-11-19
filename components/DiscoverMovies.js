import Image from "next/image";
import { useRouter } from "next/router";
import { VoteCount } from "./VoteCount";
import { ImageComponent } from "./Image";

const DiscoverMovies = ({ movie }) => {
  const router = useRouter();
  const id = movie?.id;

  return (
    <div
      onClick={() => {
        movie.release_date
          ? router.push({
              pathname: "/movies/[id]",
              query: { id },
            })
          : router.push({
              pathname: "/shows/[id]",
              query: { id },
            });
      }}
      className="w-40 md:w-56 my-2 cursor-pointer"
    >
      <div className="w-40 h-52 md:w-52 md:h-72 relative">
        <ImageComponent poster_path={movie?.poster_path} />
      </div>
      <div className="text-gray-800 dark:text-gray-400 text-sm flex items-center justify-between md:pr-5">
        <p>
          {movie?.release_date?.split("-")[0] ||
            movie?.first_air_date?.split("-")[0]}
        </p>
        <VoteCount vote={movie?.vote_average} />
      </div>
      <h1 className="text-black font-medium dark:text-light text-sm ">
        {movie?.title || movie?.name}
      </h1>
    </div>
  );
};

export default DiscoverMovies;
