import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaEye, FaRegEye } from "react-icons/fa";

import { useUserContext } from "../../contexts/UserContext";

import "./index.css";

export default function Movie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWatched, setIsWatched] = useState(false);
  const navigate = useNavigate();

  const apiKey = process.env.REACT_APP_MOVIE_API_KEY;
  const API_BASE_URL = "http://localhost:3001";

  const handleBackClick = () => navigate("/catalog");

  const user = useUserContext();
  const userId = user?.id;

  const checkIfWatched = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/watched?userId=${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Erro ao buscar filmes assistidos");

      const data = await res.json();

      console.log("Lista de filmes assistidos:", data);

      const watched = Array.isArray(data) && data.some(item => item.movieId === parseInt(id));
      setIsWatched(watched);
    } catch (err) {
      console.error("Erro ao verificar lista de assistidos", err);
    }
  }, [id, userId]);

  async function toggleWatched() {
    try {
      if (isWatched) {
        const res = await fetch(`${API_BASE_URL}/watched/${id}?userId=${userId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Falha ao remover filme da lista");

        setIsWatched(false);
      } else {
        const res = await fetch(`${API_BASE_URL}/watched`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, movieId: parseInt(id) }),
        });
        if (!res.ok) throw new Error("Falha ao adicionar filme na lista");

        setIsWatched(true);
      }
    } catch (error) {
      console.error("Erro ao alternar filme assistido:", error);
      alert("Erro ao alterar status do filme.");
    }
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
    checkIfWatched();
  }, [id, apiKey, checkIfWatched]);

  if (loading) return <p>Carregando...</p>;
  if (!movie) return <p>Filme não encontrado.</p>;

  return (
    <div className="movie-detail">
      <div style={{ display: "flex", flexDirection: "column", marginLeft: "45px" }}>
        <IoMdArrowRoundBack className="back-button" onClick={handleBackClick} />
        <h1>{movie.title}</h1>
      </div>

      <div className="movie-info">
        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />

        <div className="movie-meta">
          <button className="watch-toggle" onClick={toggleWatched}>
            {isWatched ? (
              <>
                <FaEye style={{ marginRight: "6px" }} />
                Remover dos assistidos
              </>
            ) : (
              <>
                <FaRegEye style={{ marginRight: "6px" }} />
                Marcar como assistido
              </>
            )}
          </button>

          <p>
            <strong>Título original:</strong> {movie.original_title}
          </p>
          <p>
            <strong>Status:</strong> {movie.status}
          </p>
          <p>
            <strong>Duração:</strong> {movie.runtime} min
          </p>
          <p>
            <strong>Data de lançamento:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Nota:</strong> {movie.vote_average} / 10
          </p>
          <p>
            <strong>Idioma original:</strong> {movie.original_language.toUpperCase()}
          </p>
          <p>
            <strong>Gêneros:</strong> {movie.genres.map((g) => g.name).join(", ")}
          </p>
          <p>
            <strong>Orçamento:</strong>{" "}
            {movie.budget.toLocaleString("pt-BR", { style: "currency", currency: "USD" })}
          </p>
          <p>
            <strong>Receita:</strong>{" "}
            {movie.revenue.toLocaleString("pt-BR", { style: "currency", currency: "USD" })}
          </p>
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
            {movie.production_companies.map((company) => (
              <li key={company.id}>
                {company.logo_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                    alt={company.name}
                    style={{ maxHeight: "50px", marginRight: "10px" }}
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
