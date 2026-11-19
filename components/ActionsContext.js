
import {
  createContext,
  useEffect,
  useState,
} from "react";

const actionsContext = createContext();

const FAVORITES_KEY = "cinehub_favorites";
const WATCHLIST_KEY = "cinehub_watchlist";

function readCollection(key) {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(key);
    const parsed = stored ? JSON.parse(stored) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getMediaType(item) {
  if (item.media_type === "tv") return "tv";
  if (item.media_type === "movie") return "movie";

  if (item.first_air_date || (item.name && !item.title)) {
    return "tv";
  }

  return "movie";
}

function matchesItem(a, b) {
  return (
    String(a.id) === String(b.id) &&
    getMediaType(a) === getMediaType(b)
  );
}

export function ActionsProvider({ children }) {
  const [favs, setFavs] = useState({
    favorites: [],
  });

  const [watchlist, setWatchlist] = useState({
    watchlist: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setFavs({
      favorites: readCollection(FAVORITES_KEY),
    });

    setWatchlist({
      watchlist: readCollection(WATCHLIST_KEY),
    });

    setLoading(false);
  }, []);

  const showMessage = (text) => {
    setError(false);
    setMessage(text);
  };

  const addToFavs = async (item) => {
    if (!item || item.id == null) return false;

    const current = readCollection(FAVORITES_KEY);

    if (current.some((saved) => matchesItem(saved, item))) {
      showMessage("Already in your favorites!");
      return true;
    }

    const updated = [...current, item];

    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(updated)
    );

    setFavs({ favorites: updated });
    showMessage("Added to favorites!");

    return true;
  };

  const addToWatchlist = async (item) => {
    if (!item || item.id == null) return false;

    const current = readCollection(WATCHLIST_KEY);

    if (current.some((saved) => matchesItem(saved, item))) {
      showMessage("Already in your watchlist!");
      return true;
    }

    const updated = [...current, item];

    localStorage.setItem(
      WATCHLIST_KEY,
      JSON.stringify(updated)
    );

    setWatchlist({ watchlist: updated });
    showMessage("Added to watchlist!");

    return true;
  };

  const removeFromFavorites = async (itemId) => {
    const updated = readCollection(FAVORITES_KEY).filter(
      (item) => String(item.id) !== String(itemId)
    );

    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(updated)
    );

    setFavs({ favorites: updated });
    showMessage("Removed from favorites!");

    return true;
  };

  const removeFromWatchlist = async (itemId) => {
    const updated = readCollection(WATCHLIST_KEY).filter(
      (item) => String(item.id) !== String(itemId)
    );

    localStorage.setItem(
      WATCHLIST_KEY,
      JSON.stringify(updated)
    );

    setWatchlist({ watchlist: updated });
    showMessage("Removed from watchlist!");

    return true;
  };

  const getFavorites = async () => {
    setFavs({
      favorites: readCollection(FAVORITES_KEY),
    });
  };

  const getWatchList = async () => {
    setWatchlist({
      watchlist: readCollection(WATCHLIST_KEY),
    });
  };

  return (
    <actionsContext.Provider
      value={{
        favs,
        watchlist,
        loading,
        error,
        message,
        addToFavs,
        addToWatchlist,
        removeFromFavorites,
        removeFromWatchlist,
        getFavorites,
        getWatchList,
      }}
    >
      {children}
    </actionsContext.Provider>
  );
}

export default actionsContext;
