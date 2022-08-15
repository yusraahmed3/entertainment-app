import { useState, useContext } from "react";
import userContext from "./UserContext";
import { Message } from "./Messages";

const EmailChangeForm = () => {
  const { changeEmail, error, message } = useContext(userContext);
  const [email, setEmail] = useState({
    password: "",
    oldEmail: "",
    newEmail: "",
  });

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(email);
    changeEmail(email);
  };
  return (
    <>
      {error !== null && <Message error={error} message={message} />}
      <div className="text-dark dark:text-light ">
        <h1 className="text-3xl md:text-3xl font-bold">Change Email</h1>
        <p className="text-gray-600 dark:text-gray-300">
          To change your email, please provide your password to confirm your
          identity.
        </p>
        <form className="mt-5 w-3/4 space-y-5" onSubmit={onSubmit}>
          <div className="flex flex-col space-y-2">
            <label>Password</label>
            <input
              type="password"
              value={email.password}
              onChange={(e) => setEmail({ ...email, password: e.target.value })}
              name="password"
              placeholder="Enter your password"
              className="bg-transparent p-2 outline-none border border-gray-500 rounded-md"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label>Old Email</label>
            <input
              type="text"
              value={email.oldEmail}
              onChange={(e) => setEmail({ ...email, oldEmail: e.target.value })}
              name="oldEmail"
              placeholder="Enter your old email"
              className="bg-transparent p-2 outline-none border border-gray-500 rounded-md"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label>New Email</label>
            <input
              type="text"
              value={email.newEmail}
              onChange={(e) => setEmail({ ...email, newEmail: e.target.value })}
              name="newEmail"
              placeholder="Enter your new email"
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

export default EmailChangeForm;
