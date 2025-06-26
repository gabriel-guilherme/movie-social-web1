import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import "./index.css";



export default function Catalog() {
  const apiKey = process.env.REACT_APP_MOVIE_API_KEY;
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  const navigate = useNavigate();

  const fetchMovies = useCallback(async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=pt-BR&page=${page}&sort_by=popularity.desc`
      );
      const data = await res.json();
      setMovies(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    }
  }, [page, apiKey]);

  const fetchSearch = useCallback(async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${debouncedQuery}&include_adult=false&language=pt-BR&page=${page}`
      );
      const data = await res.json();
      setMovies(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    }
  }, [page, debouncedQuery, apiKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  useEffect(() => {
    if (debouncedQuery !== '') {
      fetchSearch();
    } else {
      fetchMovies();
    }
  }, [page, debouncedQuery, fetchMovies, fetchSearch]);

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  function handleMovieClick(movieId) {
    navigate(`/catalog/${movieId}`);
  }

  return (
    <div className="catalog">
      <div className="catalog-header">
        <div className="search-div">
          <input
            className="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar filmes..."
          />
        </div>
      </div>

      <div className="movie-grid">
        {movies.slice(0, 18).map((movie) => (
          <div key={movie.id} className="movie-card" onClick={() => handleMovieClick(movie.id)}>
            <img
              className="img-movie-card"
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
            />
            <h3>{movie.title}</h3>
          </div>
          
        ))}
      </div>

      <div className="pagination-m">
        <button onClick={handlePrevious} disabled={page === 1} className="button-p">
          {"<"}
        </button>
        <span>{page}</span>
        <button onClick={handleNext} disabled={page === totalPages} className="button-p">
          {">"}
        </button>
      </div>
    </div>
    
  );
}
