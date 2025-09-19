import { useEffect, useRef, useState } from "react";
import StarRating from "./components/StarRating";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "f84fc31d";

export default function App() {
 
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState("")
  const [watched, setWatched] = useState(() => {
    const storedValue = localStorage.getItem('watched');
    return storedValue ? JSON.parse(storedValue) : [];
});

  function handleSelectMovie(id) {
    console.log(id)
    setSelectedId(id)
  }

  function handleWatchedMovie(movie) {
    setWatched((prev) => [...prev, movie] )
  }

  function handleClose() {
    setSelectedId("")
  }

  function handleDeleteMovie(id) {
    setWatched(prev => prev.filter(movie => movie.imdbID !== id))
  }

  useEffect(() => {
      localStorage.setItem('watched', JSON.stringify(watched))
  }, [watched])


  useEffect(() => {
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

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery}/>
        <NumResults movies={movies}/>
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
              <MovieDetails selectedId={selectedId} onAddWatched={handleWatchedMovie} watched={watched} onClose={handleClose}/>
            ) : (
              <>
                <WatchedSummary watched={watched}/>
                <WatchedMovieList watched={watched} onDeleteWatched={handleDeleteMovie}/>
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

function Search({query, setQuery}) {

  const inputEl = useRef(null);

  useEffect(() => {

    function callback(e) {
      if (document.activeElement === inputEl.current) return;

      if (e.code === "Enter") {
        inputEl.current.focus()
        setQuery("")
      } 
    }

    document.addEventListener('keydown', callback)
    return () => document.addEventListener("keydown", callback)
  }, [setQuery])

  return (
    <input placeholder="Search movies..." type="text" className="search" value={query} onChange={(e) => setQuery(e.target.value)} ref={inputEl}/>
  )
}

function NumResults({movies}) {
  return (
    <p className="num-results">Found <strong>{movies.length}</strong> results</p>
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

function WatchedSummary({watched}) {
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
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

function WatchedMovieList({watched, onDeleteWatched}) {
  return (
    <ul className="list">
      {watched.map((movie) => (
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

function MovieDetails({selectedId, onAddWatched, watched, onClose}) {

  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState("")

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId)

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
  } = movie;

  const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.userRating;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title, 
      year, 
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    }

    onAddWatched(newWatchedMovie);
    // onClose()
  }

  useEffect(() => {
    document.title = `Movie | ${title}`;
    return () => {
      document.title = "usePopcorn";
    }
  }, [title])

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.code === "Escape") {
        onClose()
      }
    })
  }, [onClose])

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
  }, [selectedId])

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onClose}>
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
            <div className="rating">
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
            <p>Directed by {director}</p>
          </section>
        </>
      )}
      
    </div>
  )
}