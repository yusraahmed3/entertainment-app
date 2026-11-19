
import axios from "axios";
import ItemDetail from "../../components/ItemDetail";

const ShowDetail = ({ show, cast, recommendations }) => {
  return (
    <ItemDetail
      item={show}
      cast={cast}
      recommendations={recommendations}
    />
  );
};

export default ShowDetail;

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
    const [showResponse, castResponse] = await Promise.all([
      request(`/tv/${id}`, {
        append_to_response: "videos",
      }),
      request(`/tv/${id}/credits`),
    ]);

    let recommendations = [];

    try {
      const response = await request(
        `/tv/${id}/recommendations`
      );
      recommendations = response.data.results || [];
    } catch (error) {
      console.error("Recommendations unavailable:", error.message);
    }

    return {
      props: {
        show: showResponse.data,
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
