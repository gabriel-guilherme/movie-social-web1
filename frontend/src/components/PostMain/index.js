import React, { useState } from "react";
import PostInput from "../PostInput";
import PostCard from "../PostCard";
import './index.css';

export default function PostMain() {
  const [posts, setPosts] = useState([]);

  const handlePublish = (message) => {
    if (message.trim() === '') return;
    const newPost = {
      id: Date.now(),
      name: 'Name',
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
