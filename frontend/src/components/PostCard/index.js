import React, { useEffect, useState } from 'react';
import { FaRegHeart, FaHeart, FaRocketchat, FaRegPaperPlane } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './index.css';

const TMDB_API_KEY = process.env.REACT_APP_MOVIE_API_KEY;

function PostCard({ id, name, message, time, likes, liked, onLikeToggle, movieId }) {
  const [movie, setMovie] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    if (!movieId) return;

    async function fetchMovie() {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`);
        const data = await res.json();
        setMovie({
          title: data.title,
          year: data.release_date?.slice(0, 4),
          poster: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null
        });
      } catch (err) {
        console.error('Erro ao buscar filme:', err);
      }
    }





    fetchMovie();
  }, [movieId]);

  function handleMovieClick(movieId) {
    navigate(`/catalog/${movieId}`);
  }

  return (
    <div className="post-card-container">
      <div className="post-card-header">
        <div className="post-avatar"></div>
        <div className="post-content">
          <Link to={`/profile/${name}`} className="post-name-link">
            <strong className="post-name">{name}</strong>
          </Link>
          <div className='post-text-movie'>
            <p className="post-text">{message}</p>

            {movie && (
              <div key={movieId} className="post-movie" onClick={() => handleMovieClick(movieId)}>
                {movie.poster && (
                  <img className="post-movie-poster" src={movie.poster} alt={`Poster de ${movie.title}`} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="post-card-footer">
        <div className="post-icons">
          <span onClick={() => onLikeToggle(id)} style={{ cursor: 'pointer', color: liked ? '#23232e' : 'inherit' }}>
            {liked ? <FaHeart /> : <FaRegHeart />}
          </span>
          <span style={{ cursor: 'default' }}>{likes}</span>

        </div>
        <span className="post-time">{time}</span>
      </div>
    </div>
  );
}

export default PostCard;
