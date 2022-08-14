import axios from "axios";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import userContext from "./UserContext";
const actionsContext = createContext();

export function ActionsProvider({ children }) {
  const { userState } = useContext(userContext);
  const [favs, setFavs] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const router = useRouter();

  const getWatchList = async () => {
    await axios
      .get("/api/add/watchlist", { params: { id: userState?.id } })
      .then(({ data }) => setWatchlist(data))
      .catch((error) => {
        console.error(error, "this is the error on client side");
      });
  };

  const getFavorites = async () => {
    await axios
      .get("/api/add/favorites", { params: { id: userState?.id } })
      .then(({ data }) => setFavs(data))
      .catch((error) => {
        console.error(error);
      });
  };

  const addToFavs = async (item) => {
    await axios
      .post("/api/add/favorites", item, { params: { id: userState?.id } })
      .then(({ data }) => console.log(data))
      .catch((error) => {
        console.error(error);
      });
  };

  const addToWatchlist = async (item) => {
    console.log(item);
    await axios
      .post("/api/add/watchlist", item, { params: { id: userState?.id } })
      .then(({ data }) => console.log(data))
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getWatchList();
    getFavorites();
  }, [router.pathname]);

  return (
    <actionsContext.Provider
      value={{ addToWatchlist, addToFavs, favs, watchlist }}
    >
      {" "}
      {children}
    </actionsContext.Provider>
  );
}

export default actionsContext;
