
import axios from "axios";
import DiscoverCatalog from "../../components/DiscoverCatalog";

export default function TVShows({ initialData, genres }) {
  return (
    <DiscoverCatalog
      type="tv"
      initialData={initialData}
      genres={genres}
    />
  );
}

export const getStaticProps = async () => {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    throw new Error("Missing TMDB_API_KEY in .env.local");
  }

  const [showsResponse, genresResponse] =
    await Promise.all([
      axios.get(
        "https://api.themoviedb.org/3/discover/tv",
        {
          params: {
            api_key: apiKey,
            language: "en-US",
            sort_by: "popularity.desc",
            page: 1,
          },
        }
      ),
      axios.get(
        "https://api.themoviedb.org/3/genre/tv/list",
        {
          params: {
            api_key: apiKey,
            language: "en-US",
          },
        }
      ),
    ]);

  return {
    props: {
      initialData: showsResponse.data,
      genres: genresResponse.data.genres || [],
    },
    revalidate: 3600,
  };
};
