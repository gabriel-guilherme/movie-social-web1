import React, { useEffect, useState } from "react";
import './index.css';
import { useNavigate } from 'react-router-dom';
import SideBar from "../SideBar";

const TMDB_API_KEY = process.env.REACT_APP_MOVIE_API_KEY;
const API_BASE_URL = 'http://localhost:3001';

export default function TopicSideBar() {
  const [topMovies, setTopMovies] = useState([]);

  const navigate = useNavigate();

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
              poster_path: data.poster_path,
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


   function handleMovieClick(movieId) {
    navigate(`/catalog/${movieId}`);
  }



 return (
  <SideBar className="topic-side-bar">
    <h2>Mais Comentados</h2>
    <ul>
      {topMovies.map((movie, index) => ( 
        <li key={movie.id} className="movie-item">
          <div className="movie-card-top" onClick={() => handleMovieClick(movie.id)}>
            <img 
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
              alt={`Poster de ${movie.title}`}
              className="top-side-movie-poster"
            />
          </div>
        </li>
      ))}
    </ul>
  </SideBar>
);
}
