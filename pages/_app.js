
import Layout from "../components/Layout";
import "../styles/globals.css";
import { ActionsProvider } from "../components/ActionsContext";
import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <ActionsProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ActionsProvider>
    </ThemeProvider>
  );
}

export default MyApp;
