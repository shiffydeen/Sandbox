import React from 'react'

export default function MovieList({movies, onSelectMovie}) {
  return (
    <ul className="list list-movies">
        {movies.map((movie) => (
            <li onClick={() => onSelectMovie(movie.imdbID)}>
                <img src={movie.Poster} alt="" />
                <h3>{movie.Title}</h3>
                <div>
                    <p>
                    <span>🗓</span>
                    <span>1988</span>
                    </p>
                </div>
            </li>
        ))}
    </ul>
  )
}
