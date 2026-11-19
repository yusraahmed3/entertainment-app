import axios from "axios";
import DiscoverCatalog from "../../components/DiscoverCatalog";

export default function Movies({ initialData, genres }) {
  return (
    <DiscoverCatalog
      type="movie"
      initialData={initialData}
      genres={genres}
    />
  );
}

export const getStaticProps = async () => {
  const apiKey = process.env.TMDB_API_KEY;

  const [moviesResponse, genresResponse] = await Promise.all([
    axios.get("https://api.themoviedb.org/3/discover/movie", {
      params: {
        api_key: apiKey,
        language: "en-US",
        sort_by: "popularity.desc",
        page: 1,
        include_adult: false,
      },
    }),
    axios.get("https://api.themoviedb.org/3/genre/movie/list", {
      params: {
        api_key: apiKey,
        language: "en-US",
      },
    }),
  ]);

  return {
    props: {
      initialData: moviesResponse.data,
      genres: genresResponse.data.genres || [],
    },
    revalidate: 3600,
  };
};