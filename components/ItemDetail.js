import { LargeImage } from "./LargeImage";
import { VoteCount } from "./VoteCount";
import { BsDot } from "react-icons/bs";
import { BiListPlus } from "react-icons/bi";
import { MdFavorite } from "react-icons/md";
import { useState, useContext } from "react";
import userContext from "./UserContext";
import ReactTooltip from "react-tooltip";
import actionsContext from "./ActionsContext";

const ItemDetail = ({ item, cast }) => {
  const { userState } = useContext(userContext);
  const { addToFavs, addToWatchlist } = useContext(actionsContext);
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
      className="text-dark dark:text-light flex flex-col md:flex-row items-center md:items-start space-x-10 w-full h-full pt-4"
    >
      <LargeImage poster_path={item?.poster_path} />
      <div className="w-full md:w-1/2 flex flex-col space-y-2 relative mt-5 md:mt-0 items-center md:items-start h-full ">
        <h1 className="text-2xl md:text-3xl">{item?.title || item?.name}</h1>
        <div className="flex items-center space-x-4 text-sm md:text-base md:space-x-8 text-gray-800 dark:text-gray-300">
          <p>
            {item?.release_date?.split("-")[0] ||
              item?.first_air_date?.split("-")[0]}
          </p>
          <p>{item.original_language.toUpperCase()}</p>
          <VoteCount vote={item?.vote_average} />
          <p>
            {/* if runtime exits, then it's a movie. If not, it's a tv show */}
            {item?.runtime
              ? item?.runtime + " mins"
              : item?.number_of_seasons +
                `${item.number_of_seasons > 1 ? " seasons" : " season"}  `}
          </p>
        </div>
        <div className="flex items-center md:space-x-2 text-sm md:text-base text-gray-800 dark:text-gray-200">
          {item?.genres.map((genre, index) => (
            <>
              <p>{genre.name}</p>
              {index !== item.genres.length - 1 && <BsDot />}
            </>
          ))}
        </div>
        <div className="flex flex-wrap space-x-3 text-base">
          <p className="text-gray-600 dark:text-gray-300">Production:</p>
          {item?.production_companies.map((companies, i) => (
            <p className="">
              {companies.name}
              {i !== item.production_companies.length - 1 && ","}
            </p>
          ))}
        </div>
        <div className="py-6">
          <h2 className=" text-gray-600 dark:text-gray-300">Overview</h2>
          <p className=" tracking-wide leading-relaxed">{item?.overview}</p>
        </div>
        <div className="text-sm space-y-2">
          <div className="flex">
            <p className="text-gray-600 dark:text-gray-300">
              {item.runtime ? "Director" : "Creator"}: &nbsp;
            </p>
            {item.runtime ? (
              directors?.map((person, i) => (
                <p>
                  {i !== directorsLength - 1 ? person.name + "," : person.name}
                  &nbsp;
                </p>
              ))
            ) : (
              <p>{creators[0]?.name}</p>
            )}
          </div>
          <p className="flex flex-wrap">
            <p className="text-gray-600 dark:text-gray-300">Cast: &nbsp;</p>
            {firstTenCast?.map((person, i) => {
              return (
                <p className="">
                  {i !== castLength - 1 ? person.name + "," : person.name}
                  &nbsp;
                </p>
              );
            })}
          </p>
        </div>
        <div className="flex self-start absolute bottom-28 space-x-5">
          <div className="flex flex-col">
            <button
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              data-tip
              data-for="favTip"
              onClick={() => addToFavsHandler(item)}
              className="bg-[#6290C8] text-white text-2xl font-bold p-2 hover:bg-[#4b6e99] rounded-md "
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
              className="bg-[#6290C8] text-white text-2xl font-bold p-2 hover:bg-[#4b6e99] rounded-md "
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
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
