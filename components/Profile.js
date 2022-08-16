import { useContext, useEffect, useRef } from "react";
import { Titles } from "./Titles";
import userContext from "./UserContext";

import Image from "next/image";
import { useRouter } from "next/router";
import { Message } from "./Messages";

const Profile = () => {
  const { user, changeProfilePicture, error, message } =
    useContext(userContext);
  const inputRef = useRef(null);
  const router = useRouter();

  const handlePictureChange = () => {
    inputRef.current?.click();
  };

  const pictureChangeHandler = (file) => {
    const formData = new FormData();
    formData.append("file", file[0]);
    changeProfilePicture(formData);
  };

  return (
    <>
      {error !== null && <Message error={error} message={message} />}

      <div className="text-dark dark:text-gray-300 flex flex-col space-y-10 w-full h-full">
        <Titles title="Profile settings" />
        <form className="flex flex-col md:px-5">
          <label>Email &nbsp;</label>
          <input
            readOnly
            type="text"
            value={user?.email}
            className="bg-transparent text-dark dark:text-white ring-1 ring-gray-500 p-2 rounded-md outline-none w-full md:w-1/4 mt-2"
          />
          <div className="mt-5 flex items-end">
            <div className="w-20 h-20 relative ring-1 ring-gray-200 rounded-full overflow-hidden">
              <Image
                src={user?.image}
                alt="User profile"
                unoptimized={true}
                layout="fill"
              />
            </div>
            <p onClick={handlePictureChange} className="cursor-pointer">
              Change avatar?
            </p>
            <input
              name="photo"
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={(e) => pictureChangeHandler(e.target.files)}
            />
          </div>
        </form>
        <div className="space-x-5 text-black dark:text-light">
          <button
            onClick={() => router.push("/settings/change-email")}
            className="bg-gray-200 dark:bg-gray-700 rounded-md p-3 hover:bg-gray-300 dark:hover:bg-gray-800 transition duration-200"
          >
            Change Email
          </button>
          <button
            onClick={() => router.push("/settings/change-password")}
            className="bg-gray-200 dark:bg-gray-700 rounded-md p-3 hover:bg-gray-300 dark:hover:bg-gray-800 transition duration-200"
          >
            Change Password
          </button>
        </div>
      </div>
    </>
  );
};

export default Profile;
