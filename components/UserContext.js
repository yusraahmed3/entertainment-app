import axios from "axios";
import { useRouter } from "next/router";
import { createContext, useState } from "react";
import jwtDecode from "jwt-decode";

const userContext = createContext();

export function UserProvider({ children }) {
  const [userState, setUserState] = useState();
  const [user, setUser] = useState({});
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const getUserProfile = async () => {
    await axios
      .get("/api/users/getUser", { params: { id: userState?.id } })
      .then(({ data }) => {
        setUser(data);
      })
      .catch((error) => {
        setError(error.response.data.error);
        setMessage(error.response.data.message);
        setTimeout(() => setError(null), 10000);
      });
  };

  const changeProfilePicture = async (data) => {
    console.log(data, "from context");
    await axios
      .post("/api/users/image", data, { params: { id: userState?.id } })
      .then(({ data }) => {
        setUser({ image: data.image });
        setError(data.error);
        setMessage(data.message);
        setTimeout(() => setError(null), 10000);
      })
      .catch((error) => {
        setError(error.response.data.error);
        setMessage(error.response.data.message);
        setTimeout(() => setError(null), 10000);
      });
  };

  const changeEmail = async (data) => {
    console.log("Inside email change function");
    await axios
      .put("/api/users/change-email", data, { params: { id: userState?.id } })
      .then(({ data }) => {
        console.log(data);
        setError(data.error);
        setMessage(data.message);
        setTimeout(() => setError(null), 10000);
      })
      .catch((error) => {
        setError(error.response.data.error);
        setMessage(error.response.data.message);
        setTimeout(() => setError(null), 10000);
      });
  };

  const changePassword = async (data) => {
    console.log("Inside password change function");
    await axios
      .put("/api/users/change-password", data, {
        params: { id: userState?.id },
      })
      .then(({ data }) => {
        setError(data.error);
        setMessage(data.message);
        setTimeout(() => setError(null), 10000);
      })
      .catch((error) => {
        setError(error.response.data.error);
        setMessage(error.response.data.message);
        setTimeout(() => setError(null), 10000);
      });
  };

  const isAuthenticated = () => {
    const token = JSON.parse(localStorage.getItem("user"));

    if (token) {
      setUserState(token);
      const decodedToken = jwtDecode(token.token);
      if (decodedToken.exp * 1000 < Date.now()) {
        setUserState(null);
        localStorage.removeItem("user");
      }
    } else {
      setUserState(null);
    }
  };

  const logOut = () => {
    localStorage.removeItem("user");
    setUserState(null);
    router.push("/");
  };

  const state = {
    userState,
    user,
    getUserProfile,
    setUserState,
    logOut,
    isAuthenticated,
    changeProfilePicture,
    changeEmail,
    error,
    message,
    changePassword,
  };

  return <userContext.Provider value={state}>{children}</userContext.Provider>;
}

export default userContext;
