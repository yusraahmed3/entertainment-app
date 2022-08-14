import { useContext } from "react";
import actionsContext from "../components/ActionsContext";
import DiscoverMovies from "../components/DiscoverMovies";
import { Titles } from "../components/Titles";

const SavedMovies = () => {
  const { watchlist } = useContext(actionsContext);

  return (
    <div className="text-dark dark:text-light">
      <Titles title="Watchlist" />
      <div className="flex w-full mt-5">
        {watchlist["watchlist"]?.reverse().map((movie) => {
          return (
            <div key={movie.id}>
              <DiscoverMovies movie={movie} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavedMovies;
