import Layout from "../components/Layout";
import "../styles/globals.css";
import { UserProvider } from "../components/UserContext";
import { ActionsProvider } from "../components/ActionsContext";
import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <UserProvider>
        <ActionsProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ActionsProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default MyApp;
