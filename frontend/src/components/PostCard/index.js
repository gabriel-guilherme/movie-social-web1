import React from 'react';
import { FaRegHeart, FaHeart, FaRocketchat, FaRegPaperPlane } from 'react-icons/fa';
import './index.css';

function PostCard({ id, name, message, time, likes, liked, onLikeToggle }) {
  return (
    <div className="post-card-container">
      <div className="post-card-header">
        <div className="post-avatar">👤</div>
        <div className="post-content">
          <strong className="post-name">{name}</strong>
          <p className="post-text">{message}</p>
        </div>
      </div>
      <div className="post-card-footer">
        <div className="post-icons">
          <span onClick={() => onLikeToggle(id)} style={{ cursor: 'pointer', color: liked ? 'red' : 'inherit' }}>
            {liked ? <FaHeart /> : <FaRegHeart />}
          </span>
          <span style={{ cursor: "default" }}>{likes}</span>
          <span><FaRocketchat /></span>
          <span><FaRegPaperPlane /></span>
        </div>
        <span className="post-time">{time}</span>
      </div>
    </div>
  );
}

export default PostCard;
