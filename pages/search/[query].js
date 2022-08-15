import axios from "axios";
import DiscoverMovies from "../../components/DiscoverMovies";

const SearchResult = ({ items }) => {
  return (
    <div className="w-full h-full text-white">
      <div className="flex flex-wrap justify-around w-full mt-5">
        {items?.map((movie) => {
          return (
            <div key={movie.id}>
              <DiscoverMovies movie={movie} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResult;

export const getStaticPaths = async () => {
  const { data: movie } = await axios.get(
    "https://api.themoviedb.org/3/movie/popular?api_key=d27a24aa42b8a15a34f92d9975a273e9&language=en-US&page=1"
  );

  const { data: show } = await axios.get(
    "https://api.themoviedb.org/3/tv/popular?api_key=d27a24aa42b8a15a34f92d9975a273e9&language=en-US&page=1"
  );

  const results = [...movie.results, ...show.results];

  const paths = results?.map((video) => {
    return {
      params: {
        query: `${video.title}`,
      },
    };
  });

  return {
    fallback: true,
    paths,
  };
};

export const getStaticProps = async ({ params }) => {
  const query = params?.query;
  const { data: movieSearch } = await axios.get(
    `https://api.themoviedb.org/3/search/movie?api_key=d27a24aa42b8a15a34f92d9975a273e9&language=en-US&query=${query}&include_adult=true`
  );

  const { data: showSearch } = await axios.get(
    `https://api.themoviedb.org/3/search/tv?api_key=d27a24aa42b8a15a34f92d9975a273e9&language=en-US&query=${query}&include_adult=false`
  );

  const allItems = [...movieSearch.results, ...showSearch.results];

  return {
    props: {
      items: allItems,
    },
  };
};
