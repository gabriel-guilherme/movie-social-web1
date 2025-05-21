import React, { useCallback, useEffect, useState } from "react";
import {FaSearch} from "react-icons/fa"

import "./index.css";

export default function Catalog() {
  const apiKey = '13a7a49d4fd9a1e41afc2b191db34b77'; 
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState('');

  const fetchMovies = useCallback( async () => {
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
  }, [page])

  const fetchSearch = useCallback( async () => {
    try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&include_adult=false&language=pt-BR&page=${page}`
        );
        const data = await res.json();
        setMovies(data.results);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error("Erro ao buscar filmes:", error);
      }
  }, [page, query])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== '') {
        fetchSearch();
      } else {
        fetchMovies();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, page, fetchMovies, fetchSearch]);

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="catalog">
    <div className="catalog-header">
        <h1>Catálogo</h1>
        <div className="search-div">
            <FaSearch/>
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
            {movies.slice(0, 10).map((movie) => (
            <div key={movie.id} className="movie-card">
                <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                />
                <h3>{movie.title}</h3>
            </div>
            ))}
        </div>

        <div className="pagination">
        <button onClick={handlePrevious} disabled={page === 1}>
            ← Anterior
        </button>
        <span>Página {page}</span>
        <button onClick={handleNext} disabled={page === totalPages}>
            Próxima →
        </button>
        </div>
    </div>
  );
}
