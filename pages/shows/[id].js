import axios from "axios";
import ItemDetail from "../../components/ItemDetail";

const ShowDetail = ({ show, cast }) => {
  return <ItemDetail item={show} cast={cast} />;
};

export default ShowDetail;

export const getStaticPaths = async () => {
  const { data } = await axios.get(
    "https://api.themoviedb.org/3/discover/tv?api_key=d27a24aa42b8a15a34f92d9975a273e9&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate"
  );

  const paths = data.results.map((show) => {
    return {
      params: {
        id: `${show?.id}`,
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
  const { data } = await axios.get(
    `https://api.themoviedb.org/3/tv/${ID}?api_key=d27a24aa42b8a15a34f92d9975a273e9&language=en-US`
  );

  const { data: cast } = await axios.get(
    `https://api.themoviedb.org/3/tv/${ID}/credits?api_key=d27a24aa42b8a15a34f92d9975a273e9&language=en-US`
  );

  return {
    props: {
      show: data,
      cast,
    },
  };
};
