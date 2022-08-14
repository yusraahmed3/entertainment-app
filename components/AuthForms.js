import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Message } from "./Messages";

export const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const router = useRouter();

  const submitHandler = async (e) => {
    e.preventDefault();
    await axios
      .post("/api/users/authenticate", user)
      .then(({ data }) => {
        console.log(data);
        localStorage.setItem("user", JSON.stringify(data));
        router.push("/");
      })
      .catch((error) => {
        setError(error.response.data.error);
        setMessage(error.response.data.message);
        setTimeout(() => setError(null), 10000);
      });
  };

  return (
    <>
      {error !== null && <Message error={error} message={message} />}
      <form
        className="flex flex-col space-y-8 text-dark dark:text-light mt-5"
        onSubmit={submitHandler}
      >
        <div>
          <h1 className=" text-3xl transition duration-200">Login</h1>
          <div className="text-sm text-gray-700 dark:text-gray-300 flex mt-2">
            <p className="mr-1">Don&apos;t have an account?</p>

            <p className="text-customBlue flex items-center ">
              <Link href="/signup">Create an account</Link>
              <AiOutlineArrowRight />
            </p>
          </div>
        </div>

        <input
          type="text"
          value={user.email}
          name="email"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Email"
          className="bg-transparent outline-none border border-gray-400 rounded-2xl px-2 py-3 focus:border-blue-400 "
        />
        <input
          type="text"
          value={user.password}
          name="password"
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="Passwords"
          className="bg-transparent outline-none border border-gray-400 rounded-2xl px-2 py-3 focus:border-blue-400"
        />
        <button
          type="submit"
          className="bg-customBlue text-white px-6 py-3 w-40 rounded-full "
        >
          Login
        </button>
      </form>
    </>
  );
};

export const SignUp = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const submitHandler = async (e) => {
    e.preventDefault();
    await axios
      .post("/api/users/register", user)
      .then(({ data }) => {
        setError(data.error);
        router.replace("/login");
      })
      .catch((error) => {
        setError(error.response.data.error);
        setMessage(error.response.data.message);
      });
  };
  return (
    <>
      {error && <Message error={error} message={message} />}
      <form
        className="flex flex-col space-y-8 text-dark dark:text-light mt-5"
        onSubmit={submitHandler}
      >
        <div>
          <h1 className=" text-3xl transition duration-200">
            Create a new account
          </h1>
          <div className="text-sm text-gray-700 dark:text-gray-300 flex mt-2">
            <p className="mr-1">Already registered?</p>

            <p className="text-customBlue flex items-center ">
              <Link href="/login">Log in</Link>
              <AiOutlineArrowRight />
            </p>
          </div>
        </div>
        <input
          type="text"
          name="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Email"
          className="bg-transparent outline-none border border-gray-400 rounded-2xl px-2 py-3 focus:border-blue-400"
        />
        <input
          type="text"
          name="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="Password"
          className="bg-transparent outline-none border border-gray-400 rounded-2xl px-2 py-3 focus:border-blue-400"
        />
        <input
          type="text"
          name="confirmPassword"
          value={user.confirmPassword}
          onChange={(e) =>
            setUser({ ...user, confirmPassword: e.target.value })
          }
          placeholder="Confirm Password"
          className="bg-transparent outline-none border border-gray-400 rounded-2xl px-2 py-3 focus:border-blue-400"
        />
        <button
          type="submit"
          className="bg-customBlue text-white  px-6 py-3 w-48 rounded-full"
        >
          Create account
        </button>
      </form>
    </>
  );
};
