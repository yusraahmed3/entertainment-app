import actionsContext from "../components/ActionsContext";
import DiscoverMovies from "../components/DiscoverMovies";
import { useContext } from "react";
import { Titles } from "../components/Titles";

const Favorites = () => {
  const { favs } = useContext(actionsContext);
  return (
    <div className="text-dark dark:text-light">
      <Titles title="Favorites" />
      <div className="flex w-full mt-5">
        {favs["favorites"]?.reverse().map((movie) => {
          return <DiscoverMovies movie={movie} />;
        })}
      </div>
    </div>
  );
};

export default Favorites;
