
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
    type = "movie",
    page = "1",
    genre = "",
    sort = "popularity.desc",
  } = req.query;

  if (!["movie", "tv"].includes(type)) {
    return res.status(400).json({
      error: "Invalid media type.",
    });
  }

  const allowedSorts = [
    "popularity.desc",
    "vote_average.desc",
    "primary_release_date.desc",
    "primary_release_date.asc",
    "first_air_date.desc",
    "first_air_date.asc",
  ];

  if (!allowedSorts.includes(sort)) {
    return res.status(400).json({
      error: "Invalid sorting option.",
    });
  }

  const pageNumber = Number(page);

  if (
    !Number.isInteger(pageNumber) ||
    pageNumber < 1 ||
    pageNumber > 500
  ) {
    return res.status(400).json({
      error: "Invalid page number.",
    });
  }

  if (genre && !/^\d+$/.test(String(genre))) {
    return res.status(400).json({
      error: "Invalid genre.",
    });
  }

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/${type}`,
      {
        params: {
          api_key: apiKey,
          language: "en-US",
          sort_by: sort,
          page: pageNumber,
          include_adult: false,
          with_genres: genre || undefined,
          "vote_count.gte":
            sort === "vote_average.desc" ? 100 : undefined,
        },
        timeout: 10000,
      }
    );

    return res.status(200).json({
      results: response.data.results || [],
      page: response.data.page,
      total_pages: response.data.total_pages,
      total_results: response.data.total_results,
    });
  } catch (error) {
    console.error("TMDB discover error:", error.message);

    return res.status(502).json({
      error: "Unable to load titles. Please try again.",
    });
  }
}
