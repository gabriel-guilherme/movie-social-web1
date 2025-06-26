import React, { useState, useEffect, useRef, useCallback } from "react";
import { useUserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import PostCard from "../../components/PostCard";
import EditProfileModal from "../../components/EditProfile/index.js";
import "./index.css";

const API_BASE_URL = "http://localhost:3001";
const LIMIT = 5;
const FAVORITES_LIMIT = 5;

function formatTimeAgo(isoDateString) {
  const postDate = new Date(isoDateString);
  const now = new Date();
  const diffMs = now.getTime() - postDate.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays > 0) return `há ${diffDays}d`;
  if (diffHours > 0) return `há ${diffHours}h`;
  if (diffMinutes > 0) return `há ${diffMinutes}min`;
  return `agora mesmo`;
}

export default function Profile() {
  const user = useUserContext();
  const [posts, setPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const loader = useRef(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const toggleEditModal = () => setIsEditModalOpen(!isEditModalOpen);

  const apiKey = process.env.REACT_APP_MOVIE_API_KEY;
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  const navigate = useNavigate();

  // Paginação favoritos
  const [favPage, setFavPage] = useState(1);
  const totalFavPages = Math.ceil(movies.length / FAVORITES_LIMIT);

  const handleFavPrevious = () => {
    if (favPage > 1) setFavPage(favPage - 1);
  };

  const handleFavNext = () => {
    if (favPage < totalFavPages) setFavPage(favPage + 1);
  };

  // Busca filmes assistidos no backend e detalhes na TMDB
  const fetchMovies = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/watched?userId=${user.id}`);
      const watchedMovies = await res.json();

      const moviesData = await Promise.all(
        watchedMovies.map(async (wm) => {
          const tmdbRes = await fetch(
            `https://api.themoviedb.org/3/movie/${wm.movieId}?api_key=${apiKey}&language=pt-BR`
          );
          if (!tmdbRes.ok) return null;
          const movieDetails = await tmdbRes.json();
          return { ...movieDetails, watchedAt: wm.watchedAt };
        })
      );

      const filteredMovies = moviesData.filter(Boolean);

      setMovies(filteredMovies);
      setTotalPages(1); // Sem paginação para assistidos
      setFavPage(1); // Resetar página favoritos ao recarregar
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    }
  }, [user.id, apiKey]);

  // Busca filmes pelo nome no TMDB (busca geral)
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

  // Debounce para busca
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  // Decide qual fetch chamar (busca ou filmes assistidos)
  useEffect(() => {
    if (debouncedQuery !== "") {
      fetchSearch();
    } else {
      fetchMovies();
    }
  }, [page, debouncedQuery, fetchMovies, fetchSearch]);

  // Paginação simples para busca geral
  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleMovieClick = (movieId) => {
    navigate(`/catalog/${movieId}`);
  };

  // Busca posts do usuário com paginação infinite scroll
  const fetchUserPosts = useCallback(async () => {
    if (loading || !hasMore || !user?.id) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/posts?limit=${LIMIT}&offset=${offset}&userId=${user.id}`
      );
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      const data = await response.json();
      const formattedPosts = data.map((dbPost) => ({
        authorId: dbPost.authorId,
        id: dbPost.id,
        name: dbPost.name,
        message: dbPost.content,
        likes: dbPost.likes || 0,
        liked: dbPost.liked || false,
        time: formatTimeAgo(dbPost.createdAt),
      }));

      setPosts((prev) => [...prev, ...formattedPosts]);
      setOffset((prev) => prev + LIMIT);
      if (data.length < LIMIT) setHasMore(false);
    } catch (err) {
      console.error("Erro ao buscar posts do usuário:", err);
      setError("Não foi possível carregar os posts. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }, [offset, hasMore, loading, user?.id]);

  // Reset posts e paginação quando usuário muda
  useEffect(() => {
    setPosts([]);
    setOffset(0);
    setHasMore(true);
  }, [user?.id]);

  // Busca posts iniciais quando usuário definido
  useEffect(() => {
    fetchUserPosts();
  }, [user?.id]);

  // Infinite scroll com IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchUserPosts();
        }
      },
      { threshold: 1 }
    );

    const currentLoader = loader.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [fetchUserPosts, hasMore, loading]);

  // Toggle like no post
  const handleLikeToggle = async (postId) => {
    const index = posts.findIndex((p) => p.id === postId);
    if (index === -1) return;

    const updatedPosts = [...posts];
    const post = updatedPosts[index];
    const liked = post.liked;

    try {
      const res = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
        method: liked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!res.ok) throw new Error("Erro ao alternar like.");

      post.likes += liked ? -1 : 1;
      post.liked = !liked;
      setPosts(updatedPosts);
    } catch (err) {
      console.error("Erro ao curtir/descurtir:", err);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-backgroud"></div>
        <div className="profile-image"></div>
        <div className="profile-info">
          <h2>{user?.name || "Usuário"}</h2>
          <p>@{user?.username}</p>
          <p>{user?.email}</p>
        </div>
        <button onClick={toggleEditModal}>Editar</button>
        {isEditModalOpen && <EditProfileModal user={user} onClose={toggleEditModal} />}
      </div>

      <div className="user-filmes">
        <h1>Assistidos</h1>
        <div className="user-filmes-grid">
          {movies
            .slice((favPage - 1) * FAVORITES_LIMIT, favPage * FAVORITES_LIMIT)
            .map((movie) => (
              <div
                key={movie.id}
                className="user-filmes-grid-card"
                onClick={() => handleMovieClick(movie.id)}
                style={{ cursor: "pointer" }}
                title={movie.title}
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                      : "https://via.placeholder.com/200x300?text=Sem+Imagem"
                  }
                  alt={movie.title}
                />
              </div>
            ))}
        </div>

        <div className="pagination">
          <button onClick={handleFavPrevious} disabled={favPage === 1}>
            {"<"}
          </button>
          <span>{favPage}</span>
          <button onClick={handleFavNext} disabled={favPage === totalFavPages}>
            {">"}
          </button>
        </div>

        {/* Paginação só faz sentido para busca, não para assistidos */}
        {debouncedQuery !== "" && (
          <div className="pagination">
            <button onClick={handlePrevious} disabled={page === 1}>
              {"<"}
            </button>
            <span>{page}</span>
            <button onClick={handleNext} disabled={page === totalPages}>
              {">"}
            </button>
          </div>
        )}
      </div>

      <div className="user-posts">
        {posts
          .filter((post) => post.authorId === user.id)
          .map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              name={post.name}
              message={post.message}
              time={post.time}
              likes={post.likes}
              liked={post.liked}
              onLikeToggle={handleLikeToggle}
            />
          ))}
        {loading && <p>Carregando...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div ref={loader} style={{ height: "1px" }} />
      </div>
    </div>
  );
}
