
import Head from "next/head";
import Layout from "../components/Layout";
import "../styles/globals.css";
import { ActionsProvider } from "../components/ActionsContext";
import { ThemeProvider } from "next-themes";


function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <Head>
        <title>CineHub | Discover Movies & TV Shows</title>
        <meta
          name="description"
          content="Discover movies and TV shows, explore trailers, and build your personal watchlist with CineHub."
        />
        <link
          rel="icon"
          href="/favicon.svg"
          type="image/svg+xml"
        />
      </Head>

      <ActionsProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ActionsProvider>
    </ThemeProvider>
  );
}


export default MyApp;
