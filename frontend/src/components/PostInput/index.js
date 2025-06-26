import React, { useState, useEffect, useRef } from 'react';
import { FaCamera, FaVideo, FaMicrophone, FaRegSmile } from 'react-icons/fa';
import './index.css';

const TMDB_API_KEY = process.env.REACT_APP_MOVIE_API_KEY;

function PostInput({ onPublish }) {
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [movieResults, setMovieResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const ignoreNextSearch = useRef(false);

  // Busca filmes conforme o usuário digita
  useEffect(() => {
    if (ignoreNextSearch.current) {
      // Ignora essa execução do efeito pois veio de seleção
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
        setMovieResults(data.results.slice(0, 5)); // mostra só os 5 primeiros
      } catch (err) {
        console.error('Erro ao buscar filmes:', err);
      }
    };

    const debounce = setTimeout(fetchMovies, 400);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setSearchTerm(movie.title); // mostra o nome no input
    setMovieResults([]); // esconde sugestões
    ignoreNextSearch.current = true; // evita busca logo após seleção
  };

  const handlePublishClick = () => {
    onPublish(message, selectedMovie ? selectedMovie.id : null);
    setMessage('');
    setSearchTerm('');
    setSelectedMovie(null);
    setMovieResults([]);
  };

  return (
    <div className="post-input-container">
      <div className="post-input-header">
        <div className="avatar"></div>
        <div className="post-input-fields">
          <textarea
            className="post-textarea"
            placeholder="What do you want to talk about?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
        </div>
      </div>
      <div className="post-input-footer">
        <div className="post-icons">
          <span>
            <FaCamera />
          </span>
          <span>
            <FaVideo />
          </span>
          <span>
            <FaMicrophone />
          </span>
          <span>
            <FaRegSmile />
          </span>
        </div>
        <button className="publish-button" onClick={handlePublishClick}>
          Publicar
        </button>
      </div>
    </div>
  );
}

export default PostInput;
