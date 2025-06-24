import React, { useState, useEffect } from "react";
import PostInput from "../../components/PostInput/index";
import PostCard from "../../components/PostCard";
import './index.css';

import { useUserContext } from "../../contexts/UserContext";

const API_BASE_URL = 'http://localhost:3001';

// --- Função auxiliar para formatar o tempo (NOVA LÓGICA DE MINUTOS) ---
function formatTimeAgo(isoDateString) {
  const postDate = new Date(isoDateString); // Cria um objeto Date a partir da string ISO
  const now = new Date(); // Data e hora atual

  const diffMs = now.getTime() - postDate.getTime(); // Diferença em milissegundos
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `há ${diffDays}d`;
  } else if (diffHours > 0) {
    return `há ${diffHours}h`;
  } else if (diffMinutes > 0) {
    // Se a diferença for menor que uma hora, mas mais de 0 minutos
    return `há ${diffMinutes}min`; // Agora mostra os minutos!
  } else {
    // Se a diferença for muito pequena (segundos, menos de 1 minuto)
    return `agora mesmo`; // Ou "há 0min", se preferir ser mais explícito com "min"
  }
}
// --- Fim da função auxiliar ---


export default function Home() {
  const user = useUserContext();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(user);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/posts`);
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        const data = await response.json();

        const formattedPosts = data.map(dbPost => ({
            id: dbPost.id,
            name: dbPost.author?.username || 'Usuário Desconhecido',
            message: dbPost.content,
            time: formatTimeAgo(dbPost.createdAt)
        }));
        setPosts(formattedPosts);
      } catch (err) {
        console.error("Erro ao buscar posts:", err);
        setError("Não foi possível carregar os posts. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePublish = async (message) => {
    if (message.trim() === '') return;

    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: message,
          published: true,
          authorId: user.id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao publicar post: ${errorData.error || response.statusText}`);
      }

      const newPostFromDb = await response.json();
      console.log('Post salvo no DB:', newPostFromDb);

      const formattedNewPost = {
        id: newPostFromDb.id,
        name: user.username,
        message: newPostFromDb.content,
        time: formatTimeAgo(newPostFromDb.createdAt)
      };
      setPosts([formattedNewPost, ...posts]);

    } catch (err) {
      console.error('Erro ao publicar post:', err);
      alert(`Erro ao publicar post: ${err.message}`);
    }
  };

  if (loading) {
    return <div id="post-main">Carregando posts...</div>;
  }

  if (error) {
    return <div id="post-main" style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div id="post-main">
      <PostInput onPublish={handlePublish} />
      {posts.length === 0 && !loading ? (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>Nenhum post ainda. Seja o primeiro a publicar!</p>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            name={post.name}
            message={post.message}
            time={post.time}
          />
        ))
      )}
    </div>
  );
}