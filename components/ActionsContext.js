import axios from "axios";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import userContext from "./UserContext";
const actionsContext = createContext();

export function ActionsProvider({ children }) {
  const { userState } = useContext(userContext);
  const [favs, setFavs] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const getWatchList = async () => {
    await axios
      .get("/api/add/watchlist", { params: { id: userState?.id } })
      .then(({ data }) => {
        setWatchlist(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getFavorites = async () => {
    await axios
      .get("/api/add/favorites", { params: { id: userState?.id } })
      .then(({ data }) => {
        setFavs(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const removeFromFavorites = async (itemId) => {
    if (userState) {
      await axios
        .delete("/api/add/favorites", {
          data: { userId: userState?.id, itemId },
        })
        .then(({ data }) => {
          setError(data.error);
          setMessage(data.message);
          setTimeout(() => setError(null), 3000);
        })
        .catch((error) => {
          setError(error.response.data.error);
          setMessage(error.response.data.message);
          setTimeout(() => setError(null), 3000);
        });
    }
  };

  const removeFromWatchlist = async (itemId) => {
    if (userState) {
      await axios
        .delete("/api/add/watchlist", {
          data: { userId: userState?.id, itemId },
        })
        .then(({ data }) => {
          setError(data.error);
          setMessage(data.message);
          setTimeout(() => setError(null), 3000);
        })
        .catch((error) => {
          setError(error.response.data.error);
          setMessage(error.response.data.message);
          setTimeout(() => setError(null), 3000);
        });
    }
  };

  const addToFavs = async (item) => {
    if (userState) {
      await axios
        .post("/api/add/favorites", item, { params: { id: userState?.id } })
        .then(({ data }) => {
          setError(data.error);
          setMessage(data.message);
          setTimeout(() => setError(null), 3000);
        })
        .catch((error) => {
          setError(error.response.data.error);
          setMessage(error.response.data.message);
          setTimeout(() => setError(null), 3000);
        });
    }
  };

  const addToWatchlist = async (item) => {
    if (userState) {
      await axios
        .post("/api/add/watchlist", item, { params: { id: userState?.id } })
        .then(({ data }) => {
          setError(data.error);
          setMessage(data.message);
          setTimeout(() => setError(null), 3000);
        })
        .catch((error) => {
          setError(error.response.data.error);
          setMessage(error.response.data.message);
          setTimeout(() => setError(null), 3000);
        });
    }
  };

  useEffect(() => {
    getWatchList();
    getFavorites();
  }, [router.pathname, error]);

  return (
    <actionsContext.Provider
      value={{
        addToWatchlist,
        addToFavs,
        removeFromFavorites,
        removeFromWatchlist,
        favs,
        watchlist,
        error,
        message,
      }}
    >
      {children}
    </actionsContext.Provider>
  );
}

export default actionsContext;
