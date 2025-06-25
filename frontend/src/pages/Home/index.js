import React, { useState, useEffect, useRef, useCallback } from "react";
import PostInput from "../../components/PostInput";
import PostCard from "../../components/PostCard";
import './index.css';

import { useUserContext } from "../../contexts/UserContext";

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

export default function Home() {
  const user = useUserContext();
  const [posts, setPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const loader = useRef(null);

  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore || !user?.id) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/posts?limit=${LIMIT}&offset=${offset}&userId=${user.id}`);
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      const data = await response.json();
      const formattedPosts = data.map(dbPost => ({
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
      console.error("Erro ao buscar posts:", err);
      setError("Não foi possível carregar os posts. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }, [offset, hasMore, loading, user?.id]);

  useEffect(() => {
    setPosts([]);
    setOffset(0);
    setHasMore(true);
  }, [user.id]);


  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchPosts();
        }
      },
      { threshold: 1 }
    );
    const currentLoader = loader.current;
    if (currentLoader) observer.observe(currentLoader);
    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [fetchPosts, hasMore, loading]);

  const handlePublish = async (message) => {
    if (message.trim() === '') return;

    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: message,
          authorId: user.id
        }),
      });

      if (!response.ok) throw new Error("Erro ao publicar.");

      const newPost = await response.json();
      const formattedNewPost = {
        id: newPost.id,
        name: user.username,
        message: newPost.content,
        likes: 0,
        liked: false,
        time: formatTimeAgo(newPost.createdAt)
      };

      setPosts(prev => {
        // Filtra qualquer post com o mesmo ID antes de adicionar
        const filtered = prev.filter(p => p.id !== formattedNewPost.id);
        return [formattedNewPost, ...filtered];
      });
    } catch (err) {
      console.error("Erro ao publicar post:", err);
    }
  };

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
    <div id="post-main">
      <PostInput onPublish={handlePublish} />
      {posts.map(post => (
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
  );
}
