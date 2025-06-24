import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Movie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiKey = '13a7a49d4fd9a1e41afc2b191db34b77';

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
  }, [id]);

  if (loading) return <p>Carregando...</p>;
  if (!movie) return <p>Filme não encontrado.</p>;

  return (
    <div className="movie-detail">
      <h1>{movie.title}</h1>
      <img
        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        alt={movie.title}
      />
      <p>{movie.overview}</p>
      <p><strong>Data de lançamento:</strong> {movie.release_date}</p>
      <p><strong>Nota:</strong> {movie.vote_average}</p>
    </div>
  );
}