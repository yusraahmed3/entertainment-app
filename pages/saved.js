import { useContext } from "react";
import actionsContext from "../components/ActionsContext";
import DiscoverMovies from "../components/DiscoverMovies";
import { Titles } from "../components/Titles";
import { BiTrash } from "react-icons/bi";
import { Message } from "../components/Messages";

const SavedMovies = () => {
  const { watchlist, removeFromWatchlist, error, message } =
    useContext(actionsContext);

  const removeFromWatchlistHandler = (id) => {
    removeFromWatchlist(id);
  };

  return (
    <>
      {error !== null && <Message error={error} message={message} />}
      <div className="text-dark dark:text-light">
        <Titles title="Watchlist" />
        {watchlist["watchlist"].length === 0 ? (
          <p className="mt-5">
            You haven&apos;t added any movies to your watchlist
          </p>
        ) : (
          <div className="flex flex-wrap w-full mt-5">
            {watchlist["watchlist"]?.reverse().map((movie) => {
              return (
                <div key={movie.id}>
                  <div>
                    <DiscoverMovies movie={movie} />{" "}
                  </div>
                  <span
                    onClick={() => removeFromWatchlistHandler(movie.id)}
                    className="cursor-pointer float-right -mt-5 pr-4"
                  >
                    <BiTrash />
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default SavedMovies;
