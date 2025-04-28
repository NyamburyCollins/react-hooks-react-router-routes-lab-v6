import {Link} from 'react-router-dom';

function MovieCard({title}) {
  
  return (
    <article>
        <h2>{title}</h2>
        {/* What should go here? */}
        <p>
          <Link to={`/movie/${id}`}>View Info</Link>
        </p>
    </article>
  );
};

export default MovieCard;