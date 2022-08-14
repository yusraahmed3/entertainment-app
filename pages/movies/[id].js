import axios from "axios";
import ItemDetail from "../../components/ItemDetail";

const MovieDetail = ({ movie, cast }) => {
  return <ItemDetail item={movie} cast={cast} />;
};

export default MovieDetail;

export const getStaticPaths = async () => {
  const { data } = await axios.get(
    "https://api.themoviedb.org/3/discover/movie?api_key=d27a24aa42b8a15a34f92d9975a273e9&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate"
  );

  // console.log("from static paths" + data);

  const paths = data.results.map((movie) => {
    return {
      params: {
        id: `${movie.id}`,
      },
    };
  });

  return {
    fallback: true,
    paths,
  };
};

export const getStaticProps = async ({ params }) => {
  const ID = params.id;
  const { data: movieDetails } = await axios.get(
    `https://api.themoviedb.org/3/movie/${ID}?api_key=d27a24aa42b8a15a34f92d9975a273e9&language=en-US`
  );

  const { data: cast } = await axios.get(
    `https://api.themoviedb.org/3/movie/${ID}/credits?api_key=d27a24aa42b8a15a34f92d9975a273e9&language=en-US`
  );

  // console.log(cast.crew);

  // const { data: getVideos } = await axios.get(`
  // https://api.themoviedb.org/3/movie/${ID}/videos?api_key=d27a24aa42b8a15a34f92d9975a273e9&language=en-US`);

  // console.log("from static props" + movieDetails);

  return {
    props: {
      movie: movieDetails,
      cast,
    },
  };
};
