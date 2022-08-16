import { GiChessQueen } from "react-icons/gi";
import { FiHome } from "react-icons/fi";
import { MdLocalMovies, MdFavorite } from "react-icons/md";
import { BsFillBookmarkFill } from "react-icons/bs";
import { AiOutlineLogin } from "react-icons/ai";
import { FaTv } from "react-icons/fa";
import { BiLogOutCircle } from "react-icons/bi";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import userContext from "./UserContext";

const Sidebar = () => {
  const router = useRouter();

  const { getUserProfile, userState, user, logOut } = useContext(userContext);

  useEffect(() => {
    getUserProfile();
  }, [userState]);

  // for if user is logged in
  const loggedInSideBarItems = [
    { icon: <FiHome />, url: "/" },
    { icon: <MdLocalMovies />, url: "/movies" },
    { icon: <FaTv />, url: "/shows" },
    { icon: <BsFillBookmarkFill />, url: "/saved" },
    { icon: <MdFavorite />, url: "/favorites" },
    { icon: <BiLogOutCircle />, url: "#" },
  ];

  // for guests
  const loggedOutSideBarItems = [
    { icon: <FiHome />, url: "/" },
    { icon: <MdLocalMovies />, url: "/movies" },
    { icon: <FaTv />, url: "/shows" },
    { icon: <AiOutlineLogin />, url: "/login" },
  ];
  return (
    <div className="bg-light dark:bg-dark p-2 md:m-3 h-16 md:h-[600px] w-full md:w-14 flex md:flex-col items-center justify-between  md:rounded-md shadow-md dark:shadow-none">
      <div
        className={`flex md:flex-col text-dark dark:text-white items-center  justify-between md:w-auto ${
          userState ? "w-72 md:h-96" : "w-full px-2 md:px-0 md:w-72 md:h-80"
        }`}
      >
        <span className="text-4xl">
          <GiChessQueen />
        </span>
        <div className="flex space-x-5 justify-center md:space-x-0 md:flex-col md:space-y-5 text-xl cursor-pointer ">
          {(userState ? loggedInSideBarItems : loggedOutSideBarItems).map(
            (items, index) => (
              <Link key={index} href={items.url}>
                <span
                  onClick={() => {
                    items.url === "#" && logOut();
                  }}
                  className={`hover:text-[#6290C8] ${
                    router.pathname === items.url ? "text-[#6290C8]" : ""
                  } `}
                >
                  {items.icon}
                </span>
              </Link>
            )
          )}
        </div>
      </div>
      {userState && (
        <div
          onClick={() => router.push("/profile")}
          className="w-12 h-12 relative rounded-full overflow-hidden cursor-pointer"
        >
          <Image
            src={user?.image}
            alt="User profile"
            unoptimized={true}
            layout="fill"
          />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
