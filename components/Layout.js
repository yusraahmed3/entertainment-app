import Sidebar from "./Sidebar";
import Searchbar from "./Searchbar";
import ToggleButton from "./ToggleTheme";
import userContext from "./UserContext";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

const Layout = ({ children }) => {
  return (
    <div className="w-full h-full overflow-hidden  md:flex bg-white dark:bg-darker">
      <Sidebar />

      <div className="md:flex-1 p-3 md:p-0 ">
        <div className="py-4 px-4 flex justify-between overflow-hidden">
          <Searchbar />
          <ToggleButton />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;
