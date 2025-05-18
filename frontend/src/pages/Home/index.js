// src/pages/Home/index.jsx
import React, { useState } from "react";
import PostInput from "../../components/PostInput/index";
import PostCard from "../../components/PostCard";
import './index.css';

import { useUserContext } from "../../contexts/UserContext";

export default function Home() {
  const user = useUserContext();
  const [posts, setPosts] = useState([]);

  const handlePublish = (message) => {
    if (message.trim() === '') return;

    const newPost = {
      id: Date.now(),
      name: `${user.firstName} ${user.lastName}`,
      message: message,
      time: 'há poucos segundos'
    };

    setPosts([newPost, ...posts]);
  };

  return (
    <div id="post-main">
      <PostInput onPublish={handlePublish} />
      {posts.map((post) => (
        <PostCard
          key={post.id}
          name={post.name}
          message={post.message}
          time={post.time}
        />
      ))}
    </div>
  );
}
