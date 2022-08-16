import { useState, useContext } from "react";
import { Message } from "./Messages";
import userContext from "./UserContext";

const PasswordChangeForm = () => {
  const { changePassword, error, message } = useContext(userContext);
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPass: "",
  });

  const onSubmit = (e) => {
    e.preventDefault();
    changePassword(password);
  };
  return (
    <>
      {error !== null && <Message error={error} message={message} />}
      <div className="text-dark dark:text-light ">
        <h1 className="text-2xl md:text-3xl font-bold">Change Password</h1>
        <p className="text-gray-600 dark:text-gray-300">
          To change your password, please provide your old password to confirm
          your identity.
        </p>
        <form className="mt-5 w-3/4 space-y-5" onSubmit={onSubmit}>
          <div className="flex flex-col space-y-2">
            <label>Old password</label>
            <input
              type="password"
              value={password.oldPassword}
              onChange={(e) =>
                setPassword({ ...password, oldPassword: e.target.value })
              }
              name="password"
              placeholder="Enter your old password"
              className="bg-transparent p-2 outline-none border border-gray-500 rounded-md"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label>New password</label>
            <input
              type="password"
              value={password.newPassword}
              onChange={(e) =>
                setPassword({ ...password, newPassword: e.target.value })
              }
              name="newPass"
              placeholder="Enter your new password"
              className="bg-transparent p-2 outline-none border border-gray-500 rounded-md"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label>Confirm new password</label>
            <input
              type="password"
              value={password.confirmNewPass}
              onChange={(e) =>
                setPassword({ ...password, confirmNewPass: e.target.value })
              }
              name="confirmPwd"
              placeholder="Confirm your new password"
              className="bg-transparent p-2 outline-none border border-gray-500 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="bg-customBlue text-white p-2 rounded-full w-20"
          >
            Save
          </button>
        </form>
      </div>
    </>
  );
};

export default PasswordChangeForm;
