import React, { useState, useEffect, useRef, useCallback } from "react";
import imagem from "../../assets/perfil.png";
import { useUserContext } from "../../contexts/UserContext";
import PostCard from "../../components/PostCard";
import './index.css';

const API_BASE_URL = 'http://localhost:3001';
const LIMIT = 5;

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

  const fetchUserPosts = useCallback(async () => {
    if (loading || !hasMore || !user?.id) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/posts?limit=${LIMIT}&offset=${offset}&userId=${user.id}`);
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      const data = await response.json();
      const formattedPosts = data.map(dbPost => ({
        authorId: dbPost.authorId,
        id: dbPost.id,
        name: dbPost.name,
        message: dbPost.content,
        likes: dbPost.likes || 0,
        liked: dbPost.liked || false,
        time: formatTimeAgo(dbPost.createdAt)
      }));

      setPosts(prev => [...prev, ...formattedPosts]);
      setOffset(prev => prev + LIMIT);
      if (data.length < LIMIT) setHasMore(false);
    } catch (err) {
      console.error("Erro ao buscar posts do usuário:", err);
      setError("Não foi possível carregar os posts. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }, [offset, hasMore, loading, user?.id]);

  useEffect(() => {
    // Resetar posts quando o usuário mudar
    setPosts([]);
    setOffset(0);
    setHasMore(true);
  }, [user?.id]);

  useEffect(() => {
    fetchUserPosts();
  }, [user?.id]); // Carrega os posts iniciais quando o usuário é definido

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
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

  const handleLikeToggle = async (postId) => {
    const index = posts.findIndex(p => p.id === postId);
    if (index === -1) return;

    const updatedPosts = [...posts];
    const post = updatedPosts[index];
    const liked = post.liked;

    try {
      const res = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
        method: liked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
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
          <h2>{user?.name || 'Usuário'}</h2>
          <p>@{user?.username}</p>
          <p>{user?.email}</p>
        </div>
      </div>

      <div className="user-posts">
        {posts
          .filter(post => post.authorId === user.id)
          .map(post => (
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
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <div ref={loader} style={{ height: '1px' }} />
      </div>
    </div>
  );
}