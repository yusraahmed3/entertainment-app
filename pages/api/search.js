
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "TMDB API key is not configured.",
    });
  }

  const {
    query = "",
    type = "all",
    page = "1",
  } = req.query;

  const searchQuery =
    typeof query === "string" ? query.trim() : "";

  const pageNumber = Number(page);

  if (!searchQuery) {
    return res.status(400).json({
      error: "Please enter a search term.",
    });
  }

  if (searchQuery.length > 200) {
    return res.status(400).json({
      error: "Search term is too long.",
    });
  }

  if (!["all", "movie", "tv"].includes(type)) {
    return res.status(400).json({
      error: "Invalid search type.",
    });
  }

  if (
    !Number.isInteger(pageNumber) ||
    pageNumber < 1 ||
    pageNumber > 500
  ) {
    return res.status(400).json({
      error: "Invalid page number.",
    });
  }

  try {
    const endpoint =
      type === "all" ? "multi" : type;

    const response = await axios.get(
      `https://api.themoviedb.org/3/search/${endpoint}`,
      {
        params: {
          api_key: apiKey,
          language: "en-US",
          query: searchQuery,
          page: pageNumber,
          include_adult: false,
        },
        timeout: 10000,
      }
    );

    const results = (response.data.results || [])
      .filter((item) => {
        const mediaType =
          item.media_type || type;

        return (
          mediaType === "movie" ||
          mediaType === "tv"
        );
      })
      .map((item) => ({
        ...item,
        media_type: item.media_type || type,
      }));

    return res.status(200).json({
      results,
      page: response.data.page,
      total_pages: response.data.total_pages,
      total_results: response.data.total_results,
    });
  } catch (error) {
    console.error("TMDB search error:", error.message);

    return res.status(502).json({
      error: "Unable to search titles. Please try again.",
    });
  }
}
