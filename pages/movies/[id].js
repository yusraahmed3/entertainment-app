
import axios from "axios";
import ItemDetail from "../../components/ItemDetail";

const MovieDetail = ({ movie, cast, recommendations }) => {
  return (
    <ItemDetail
      item={movie}
      cast={cast}
      recommendations={recommendations}
    />
  );
};

export default MovieDetail;

export const getStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps = async ({ params }) => {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    throw new Error("Missing TMDB_API_KEY in .env.local");
  }

  const id = params.id;

  const request = (path, extraParams = {}) =>
    axios.get(`https://api.themoviedb.org/3${path}`, {
      params: {
        api_key: apiKey,
        language: "en-US",
        ...extraParams,
      },
    });

  try {
    const [movieResponse, castResponse] = await Promise.all([
      request(`/movie/${id}`, {
        append_to_response: "videos",
      }),
      request(`/movie/${id}/credits`),
    ]);

    let recommendations = [];

    try {
      const response = await request(
        `/movie/${id}/recommendations`
      );
      recommendations = response.data.results || [];
    } catch (error) {
      console.error("Recommendations unavailable:", error.message);
    }

    return {
      props: {
        movie: movieResponse.data,
        cast: castResponse.data,
        recommendations,
      },
      revalidate: 3600,
    };
  } catch (error) {
    if (error.response?.status === 404) {
      return { notFound: true };
    }

    throw error;
  }
};
