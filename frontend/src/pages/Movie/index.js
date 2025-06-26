import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";

import "./index.css";

export default function Movie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const apiKey = process.env.REACT_APP_MOVIE_API_KEY;

  function handleBackClick() {
    navigate('/catalog');
  }

  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=pt-BR`
        );
        const data = await res.json();
        setMovie(data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do filme:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
  }, [id, apiKey]);

  if (loading) return <p>Carregando...</p>;
  if (!movie) return <p>Filme não encontrado.</p>;

  return (
    <div className="movie-detail">
      <div style={{ display: "flex", flexDirection: "column", marginLeft: "45px" }}>
        <IoMdArrowRoundBack className="back-button" onClick={handleBackClick}/>
        <h1 style={{ marginLeft: "0px" }}>{movie.title}</h1>
      </div>
      

      <div className="movie-info">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />

        <div className="movie-meta">
          <p><strong>Título original:</strong> {movie.original_title}</p>
          <p><strong>Status:</strong> {movie.status}</p>
          <p><strong>Duração:</strong> {movie.runtime} min</p>
          <p><strong>Data de lançamento:</strong> {movie.release_date}</p>
          <p><strong>Nota:</strong> {movie.vote_average} / 10</p>
          <p><strong>Idioma original:</strong> {movie.original_language.toUpperCase()}</p>
          <p><strong>Gêneros:</strong> {movie.genres.map(g => g.name).join(", ")}</p>
          <p><strong>Orçamento:</strong> {movie.budget.toLocaleString('pt-BR', { style: 'currency', currency: 'USD' })}</p>
          <p><strong>Receita:</strong> {movie.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'USD' })}</p>
          {movie.homepage && (
            <p><strong>Site oficial:</strong> <a href={movie.homepage} target="_blank" rel="noopener noreferrer">{movie.homepage}</a></p>
          )}
          <div className="movie-overview">
            <h2>Sinopse</h2>
            <p>{movie.overview}</p>
          </div>
        </div>
      </div>

      

      {movie.production_companies?.length > 0 && (
        <div className="movie-production">
          <h3>Produzido por:</h3>
          <ul className="production-companies">
            {movie.production_companies.map(company => (
              <li key={company.id}>
                {company.logo_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                    alt={company.name}
                    style={{ maxHeight: '50px', marginRight: '10px' }}
                  />
                )}
                {company.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
