import React, { useEffect, useState } from 'react'

const KEY = "6996f8ed";

export default function MovieDetails({selectedId}) {

    const [movie, setMovie] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const {Poster, Title, released, runtime, genre, imdbRating} = movie

   
    async function fetchSpecificMovie() {

        try {
            const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`)
            if(!res.ok) throw new Error("There was an error fetching the movie details");
            
            const data = await res.json()
            setMovie(data)
            console.log(data)
        } catch (error) {
            setError(error.message)
        }

    
    }

  useEffect(() => {
    fetchSpecificMovie()
  }, [])


  return (
    <div className="details">
        <header>
            <button>←</button>
            <img src={movie.Poster} alt="" />
            <div className="details-overview">
                <h2>{movie.Title}</h2>
                <p>{movie.released} &bull; {movie.runtime}</p>
                <p>{movie.genre}</p>
            <p>
            <span>⭐️</span>
            {movie.imdbRating} IMDb rating
            </p>
            </div>
        </header>
        <section>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
        </section>
    </div>
  )
}
