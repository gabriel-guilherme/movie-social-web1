import React, { useState } from 'react';
import { FaCamera, FaVideo, FaMicrophone, FaRegSmile } from 'react-icons/fa';
import './index.css';

function PostInput({ onPublish }) {
  const [message, setMessage] = useState('');

  const handlePublishClick = () => {
    onPublish(message);
    setMessage('');
  };

  return (
    <div className="post-input-container">
      <div className="post-input-header">
        <div className="avatar">👤</div>
        <textarea
          className="post-textarea"
          placeholder="What do you want to talk about?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <div className="post-input-footer">
        <div className="post-icons">
          <span><FaCamera /></span>
          <span><FaVideo /></span>
          <span><FaMicrophone /></span>
          <span><FaRegSmile /></span>
        </div>
        <button className="publish-button" onClick={handlePublishClick}>Publicar</button>
      </div>
    </div>
  );
}

export default PostInput;
