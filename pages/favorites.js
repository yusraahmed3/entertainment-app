import actionsContext from "../components/ActionsContext";
import DiscoverMovies from "../components/DiscoverMovies";
import { Titles } from "../components/Titles";
import { useContext } from "react";
import { BiTrash } from "react-icons/bi";
import { Message } from "../components/Messages";

const Favorites = () => {
  const { favs, removeFromFavorites, error, message } =
    useContext(actionsContext);

  const removeFromFavoritesHandler = (id) => {
    removeFromFavorites(id);
  };

  return (
    <>
      {error !== null && <Message error={error} message={message} />}
      <div className="text-dark dark:text-light">
        <Titles title="Favorites" />
        {favs["favorites"].length === 0 ? (
          <p className="mt-5">
            You haven&apos;t added any movies to your favorites
          </p>
        ) : (
          <div className="flex flex-wrap w-full mt-5">
            {favs["favorites"]?.reverse().map((movie) => {
              return (
                <div key={movie.id}>
                  <div>
                    <DiscoverMovies movie={movie} />{" "}
                  </div>
                  <span
                    onClick={() => removeFromFavoritesHandler(movie.id)}
                    className="cursor-pointer float-right -mt-5 pr-4"
                  >
                    {" "}
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

export default Favorites;
