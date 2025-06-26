import React, { useEffect, useState } from "react";
import './index.css';
import SideBar from "../SideBar";

const TMDB_API_KEY = process.env.REACT_APP_MOVIE_API_KEY;
const API_BASE_URL = 'http://localhost:3001';

export default function TopicSideBar() {
  const [topMovies, setTopMovies] = useState([]);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/popular-movies`);
        const movieStats = await res.json();

        const movieDetails = await Promise.all(
          movieStats.map(async (item) => {
            const tmdbRes = await fetch(`https://api.themoviedb.org/3/movie/${item.movieId}?api_key=${TMDB_API_KEY}`);
            const data = await tmdbRes.json();
            return {
              id: item.movieId,
              title: data.title,
              year: data.release_date?.slice(0, 4),
              count: item.count,
            };
          })
        );

        setTopMovies(movieDetails);
      } catch (err) {
        console.error("Erro ao carregar filmes populares:", err);
      }
    };

    fetchPopularMovies();
  }, []);

  return (
    <SideBar title={"Mais comentados"} className="topic-side-bar">
      <ul>
        {topMovies.map(movie => (
          <li key={movie.id}>
            🎬 {movie.title} {movie.year && `(${movie.year})`} — {movie.count} posts
          </li>
        ))}
      </ul>
    </SideBar>
  );
}
