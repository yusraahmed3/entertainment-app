import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import { useRouter } from "next/router";

const Searchbar = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const submitHamdler = async (e) => {
    e.preventDefault();

    if (query === "" || !query || !query.length) {
      router.push("/search");
    } else {
      router.push({
        pathname: "/search/[query]",
        query: { query },
      });
    }
  };

  return (
    <form
      onSubmit={submitHamdler}
      className="text-black dark:text-white relative w-3/4 lg:w-1/4 ring-1 dark:ring-gray-600 rounded-full p-2 bg-gray-100 dark:bg-transparent"
    >
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search"
        className=" bg-transparent outline-none w-full placeholder:text-dark dark:placeholder:text-light"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-xl cursor-pointer"
      >
        <AiOutlineSearch />
      </button>
    </form>
  );
};

export default Searchbar;
