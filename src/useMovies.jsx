import { useEffect } from "react";
import { useState } from "react";


const KEY = "f84fc31d";

export function useMovies(query) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
    // callback?.();
    const controller = new AbortController();
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("")
        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, {signal: controller.signal});

        if (!res.ok) {
          throw new Error("Something went wrong with fetching movies");
        }

        const data = await res.json();
        if (data.Response === "False") {
          throw new Error("Movie not found");
        }
        // console.log(data)
        setMovies(data.Search)
        setError("")
      } catch (error) {
        console.log(error.message)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
    }

    fetchMovies()

    return function () {
      controller.abort();
    }

  }, [query])

  return {movies, isLoading, error}

}