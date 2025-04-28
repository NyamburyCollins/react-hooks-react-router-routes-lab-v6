import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";

function Movie() {
  const [movie, setMovie] = useState([])
  const params = useParams();
  const movieId = params.id

  useEffect(() => {
    fetch(`http://localhost:4000/movies/${movieId}`)
    .then(res => res.json())
    .then(data => setMovie(data))
    .catch(error => console.error(error))
  }, [movieId])

    const genre = movie.genres ? movie.genres.map(genre => <span key={genre}>{genre}</span>) : null;

  return (
    <>
      <header>
        <NavBar />
      </header>
      <main>
        <h1>{movie.title}</h1>
        <p>{movie.time}</p>
        {genre}
      </main>
    </>
  );
};

export default Movie;