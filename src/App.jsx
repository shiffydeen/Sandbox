import { useEffect, useState } from "react";
import Error from "./components/Error";
import Loader from "./components/Loader";
import MovieList from "./components/MovieList";
import MovieDetails from "./components/MovieDetails";

function App() {


  const KEY = "6996f8ed";

  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [watched, setWatched] = useState([])
  // const [isLoading2, setIsLoading2] = useState(false)


  async function fetchMovies() {
    try {
      setError("")
      setIsLoading(true)
      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`)
      if (!res.ok) throw new Error("There was an error with fetching the movie");
      const data = await res.json();
      if (data.Response === "False") throw new Error("Movie not found");
      
      const movies = data.Search
      console.log(movies)
      setMovies(movies)
      setIsLoading(false)
    } catch (error) {
      setError(error.message)
      setIsLoading(false)
      // console.log(error.message)
    }
  }

  function handleSelectMovie(id) {
    setSelectedId(id)
  }

  useEffect(() => {
    if (query.length < 3) {
      return
    }
    fetchMovies()
  }, [query])

  // fetchMovies()
  return (
    <div>
      <nav className="nav-bar">
        <div className="logo"></div>
        <input className="search" type="text" placeholder="Search movies" onChange={(e) => setQuery(e.target.value)}/>
        <p className="num-results"></p>
      </nav>
      <main className="main">
        <div className="box">
          <button className="btn-toggle">-</button>

          {error && (
            <Error message={error}/>
          )}

          {isLoading && (<Loader />)}

          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie}/>
          )}
        
        
          
        </div>
        <div className="box">
          <button className="btn-toggle">-</button>
          {selectedId ? (
            <MovieDetails selectedId={selectedId}/>
          ) : (
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
                  <span>⭐️</span>
                  <span>0.00</span>
                </p>
                <p>
                  <span>⏳</span>
                  <span>0 min</span>
                </p>
              </div>
            </div>
          )}
 
          <ul className="list"></ul>
        </div>
      </main>
    </div>
  )
}


export default App