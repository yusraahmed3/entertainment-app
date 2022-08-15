import { LargeImage } from "./LargeImage";
import { VoteCount } from "./VoteCount";
import { BsDot } from "react-icons/bs";
import { BiListPlus } from "react-icons/bi";
import { MdFavorite } from "react-icons/md";
import { useState, useContext } from "react";
import userContext from "./UserContext";
import ReactTooltip from "react-tooltip";
import actionsContext from "./ActionsContext";
import { Message } from "./Messages";

const ItemDetail = ({ item, cast }) => {
  const { userState } = useContext(userContext);
  const { addToFavs, addToWatchlist, error, message } =
    useContext(actionsContext);
  const [tooltip, showTooltip] = useState(false);
  // show the first ten cast members
  const firstTenCast = cast?.cast?.slice(0, 10);
  const castLength = firstTenCast?.length;
  // show only the directors
  const directors = cast?.crew?.filter((crew) => crew.job === "Director");

  // show only executive producers
  const creators = cast?.crew?.filter(
    (crew) => crew.job === "Executive Producer"
  );

  const creatorsLength = creators?.length;
  const directorsLength = directors?.length;

  const onMouseOver = () => {
    if (!userState) {
      showTooltip(true);
    } else {
      return;
    }
  };

  const onMouseOut = () => {
    if (!userState) {
      showTooltip(false);
      setTimeout(() => showTooltip(true), 50);
    } else {
      return;
    }
  };

  const addToFavsHandler = (item) => {
    if (!userState) {
      return;
    } else {
      addToFavs(item);
    }
  };

  const addToWatchlistHandler = (item) => {
    // check if token exits
    if (!userState) {
      return;
    } else {
      addToWatchlist(item);
    }
  };

  return (
    <div
      key={item?.id}
      className="text-dark dark:text-light flex flex-col md:flex-row items-center md:items-start space-x-10 w-full pt-4"
    >
      <LargeImage poster_path={item?.poster_path} />
      <div className="w-full md:w-1/2 flex flex-col space-y-2 mt-5 md:mt-0 items-center md:items-start ">
        <h1 className="text-2xl md:text-3xl">{item?.title || item?.name}</h1>
        <div className="flex items-center space-x-4 text-sm md:text-base md:space-x-8 text-gray-800 dark:text-gray-300">
          <p>
            {item?.release_date?.split("-")[0] ||
              item?.first_air_date?.split("-")[0]}
          </p>
          <p>{item?.original_language.toUpperCase()}</p>
          <VoteCount vote={item?.vote_average} />
          <p>
            {/* if runtime exits, then it's a movie. If not, it's a tv show */}
            {item?.runtime
              ? item?.runtime + " mins"
              : item?.number_of_seasons +
                `${item?.number_of_seasons > 1 ? " seasons" : " season"}  `}
          </p>
        </div>
        <div className="flex items-center md:space-x-2 text-sm md:text-base text-gray-800 dark:text-gray-200">
          {item?.genres.map((genre, index) => (
            <div key={index} className="flex items-center md:space-x-2">
              <p>{genre.name}</p>
              {index !== item?.genres.length - 1 && <BsDot />}
            </div>
          ))}
        </div>

        <div className="py-6">
          <div className="flex flex-wrap mb-1">
            <p className="text-gray-600 dark:text-gray-300 mr-1">Production:</p>
            {item?.production_companies.map((companies, i) => (
              <p className="mr-1" key={i}>
                {companies.name}
                {i !== item?.production_companies.length - 1 && ","}
              </p>
            ))}
          </div>
          <h2 className="text-gray-600 dark:text-gray-300">Overview:</h2>
          <p className="tracking-wide leading-relaxed">{item?.overview}</p>
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap">
            <p className="text-gray-600 dark:text-gray-300 mr-1">
              {item?.runtime ? "Director" : "Creator"}:
            </p>
            {item?.runtime
              ? directors?.map((person, i) => (
                  <p key={i} className="mr-1">
                    {i !== directorsLength - 1
                      ? person.name + ","
                      : person.name}
                  </p>
                ))
              : creators?.map((person, i) => (
                  <p key={i} className="mr-1">
                    {i !== creatorsLength - 1 ? person.name + "," : person.name}
                  </p>
                ))}
          </div>
          <p className="flex flex-wrap">
            <p className="text-gray-600 dark:text-gray-300 mr-1">Cast: </p>
            {firstTenCast?.map((person, i) => {
              return (
                <p className="mr-1" key={i}>
                  {i !== castLength - 1 ? person.name + "," : person.name}
                </p>
              );
            })}
          </p>
        </div>
        <div className="flex self-start space-x-5 pt-5 items-baseline w-full">
          <div className="flex flex-col">
            <button
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              data-tip
              data-for="favTip"
              onClick={() => addToFavsHandler(item)}
              className="bg-customBlue text-white text-2xl font-bold p-2 hover:bg-[#4b6e99] rounded-md "
            >
              <MdFavorite />
            </button>
            {/*  show tool tip if not logged in */}
            {tooltip && (
              <ReactTooltip
                id="favTip"
                place="bottom"
                effect="solid"
                backgroundColor="#4b6e99"
              >
                <span>Log in to add to favorites</span>
              </ReactTooltip>
            )}
          </div>
          <div>
            <button
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              data-tip
              data-for="watchListTip"
              onClick={() => addToWatchlistHandler(item)}
              className="bg-customBlue text-white text-2xl font-bold p-2 hover:bg-[#4b6e99] rounded-md "
            >
              <BiListPlus />
            </button>
            {tooltip && (
              <ReactTooltip
                id="watchListTip"
                place="bottom"
                effect="solid"
                backgroundColor="#4b6e99"
              >
                <span>Log in to add to watchlist</span>
              </ReactTooltip>
            )}
          </div>
          {error !== null && <Message error={error} message={message} />}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
