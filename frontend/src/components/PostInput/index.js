import React, { useState, useEffect, useRef } from 'react';
import { FaCamera, FaVideo, FaMicrophone, FaRegSmile, FaCat } from 'react-icons/fa';
import './index.css';

const TMDB_API_KEY = process.env.REACT_APP_MOVIE_API_KEY;

function PostInput({ onPublish }) {
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [movieResults, setMovieResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);

  const ignoreNextSearch = useRef(false);

  useEffect(() => {
    if (ignoreNextSearch.current) {
      ignoreNextSearch.current = false;
      return;
    }

    const fetchMovies = async () => {
      if (!searchTerm.trim()) {
        setMovieResults([]);
        return;
      }

      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            searchTerm
          )}&api_key=${TMDB_API_KEY}`
        );
        const data = await res.json();
        setMovieResults(data.results.slice(0, 5));
      } catch (err) {
        console.error('Erro ao buscar filmes:', err);
      }
    };

    const debounce = setTimeout(fetchMovies, 400);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setSearchTerm(movie.title);
    setMovieResults([]);
    ignoreNextSearch.current = true;
  };

  const handleCatClick = async () => {
    try {
      setLoadingImage(true);
      const res = await fetch("https://api.thecatapi.com/v1/images/search");
      const data = await res.json();
      setImageUrl(data[0].url);
    } catch (err) {
      console.error("Erro ao buscar imagem de gato:", err);
    } finally {
      setLoadingImage(false);
    }
  };

  const handlePublishClick = () => {
    onPublish(message, selectedMovie ? selectedMovie.id : null, imageUrl);
    setMessage('');
    setSearchTerm('');
    setSelectedMovie(null);
    setMovieResults([]);
    setImageUrl(null);
  };

  return (
    <div className="post-input-container">
      <div className="post-input-header">
        <div className="avatar"></div>
        <div className="post-input-fields">
          <textarea
            className="post-textarea"
            placeholder="Qual sua experiência com seu último filme?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={600}
          />
          <div className="movie-autocomplete">
            <input
              type="text"
              className="movie-search-input"
              placeholder="Buscar filme"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedMovie(null);
              }}
            />
            {movieResults.length > 0 && (
              <ul className="movie-suggestions">
                {movieResults.map((movie) => (
                  <li key={movie.id} onClick={() => handleMovieSelect(movie)}>
                    {movie.title}{' '}
                    {movie.release_date
                      ? `(${movie.release_date.slice(0, 4)})`
                      : ''}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {imageUrl && (
            <div className="cat-preview">
              <img src={imageUrl} alt="Gato aleatório" />
            </div>
          )}
        </div>
      </div>

      <div className="post-input-footer">
        <div className="post-icons">
          <button onClick={handleCatClick} title="Adicionar imagem de gato">
            <FaCat />
          </button>
          {loadingImage && <span style={{ fontSize: '0.8em' }}>Carregando...</span>}
        </div>
        <button className="publish-button" onClick={handlePublishClick}>
          Publicar
        </button>
      </div>
    </div>
  );
}

export default PostInput;
