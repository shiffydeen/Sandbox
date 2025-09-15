import { useEffect, useState } from "react";
import StarRating from "./components/StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "f84fc31d";

export default function App() {
 
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState("")

  function handleSelectMovie(id) {
    console.log(id)
    setSelectedId(id)
  }


  useEffect(() => {
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("")
        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`);

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
  }, [query])

  return (
    <>
      <NavBar>
        <input placeholder="Search movies..." type="text" className="search" value={query} onChange={(e) => setQuery(e.target.value)}/>
        <p className="num-results">Found <strong>0</strong> results</p>
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error}/>}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          
        </Box>
        <Box>
          {
            selectedId ? (
              <MovieDetails selectedId={selectedId}/>
            ) : (
              <>
                <WatchedSummary />
                <WatchedMovieList />
              </>
            )
            }
        </Box>
      </Main>
    </>
  );
}

// Navbar

function NavBar({children}) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  )
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  )
}



// Main

function Main({children}) {
  return (
    <main className="main">
      {children}
    </main>
  )
}

function Box({children}) {
  return (
    <div className="box">
      <button className="btn-toggle">-</button>
      {children}
    </div>
  )
}


function MovieList({movies, onSelectMovie}) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} onSelectMovie={onSelectMovie}/>
      ))}
    </ul>
  )
}

function Movie({movie, onSelectMovie}) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt="" />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  )
}

function WatchedSummary() {
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>0 movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>0.00</span>
        </p>
        <p>
          <span>🌟</span>
          <span>0.00</span>
        </p>
        <p>
          <span>⏳</span>
          <span>0 min</span>
        </p>
      </div>
    </div>
  )
}

function WatchedMovieList() {
  return (
    <ul className="list">
      {tempWatchedData.map((movie) => (
        <li>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>⭐️</span>
              <span>{movie.imdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie.userRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.runtime} min</span>
            </p>

            <button
              className="btn-delete"
              onClick={() => onDeleteWatched(movie.imdbID)}
            >
              X
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

function Loader() {
  return (
    <p className="loader">Loading...</p>
  )
}

function ErrorMessage({message}) {
  return (
    <p className="error">
      <span>⛔️</span>{message}
    </p>
  )
}

function MovieDetails({selectedId}) {

  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState({})

  const {
    Title: title,
    Year: year,
    Poster: poster, 
    Runtime: runtime, 
    imdbRating, 
    Plot: plot, 
    Released: released,
    Actors: actors, 
    Director: director,
    Genre: genre,
  } = movie

  useEffect(() => {
    async function getMovieDetails() {
      // console.log("Hello")
      // console.log(selectedId)
      setIsLoading(true)
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data = await res.json();
      console.log(data)
      setMovie(data)
      setIsLoading(false)

    }
    getMovieDetails()
  }, [])

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back">
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            {/* <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated with movie {watchedUserRating} <span>⭐️</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p> */}
          </section>
        </>
      )}
      
    </div>
  )
}