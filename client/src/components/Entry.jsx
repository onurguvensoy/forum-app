import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  ThumbUpAlt, 
  ThumbDownAlt, 
  Visibility, 
  ThumbUpOffAlt,
  ThumbDownOffAlt
} from '@mui/icons-material';
import './Entry.css';

const Entry = ({ _id, title, content, username, viewCount = 0, likes = 0, dislikes = 0, hasLiked = false, hasDisliked = false, onUpdate }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(hasLiked);
  const [isDisliked, setIsDisliked] = useState(hasDisliked);
  const [likeCount, setLikeCount] = useState(likes);
  const [dislikeCount, setDislikeCount] = useState(dislikes);
  const [views, setViews] = useState(viewCount);

  // Update state when props change
  useEffect(() => {
    setIsLiked(hasLiked);
    setIsDisliked(hasDisliked);
    setLikeCount(likes);
    setDislikeCount(dislikes);
    setViews(viewCount);
  }, [hasLiked, hasDisliked, likes, dislikes, viewCount]);

  const handleLike = async (e) => {
    e.stopPropagation(); // Prevent entry click event
    try {
      // Optimistically update UI
      const willBeLiked = !isLiked;
      setIsLiked(willBeLiked);
      if (isDisliked) {
        setIsDisliked(false);
        setDislikeCount(prev => Math.max(0, prev - 1));
      }
      setLikeCount(prev => willBeLiked ? prev + 1 : Math.max(0, prev - 1));

      const response = await axios.post(
        `http://localhost:4000/api/entries/${_id}/like`,
        {},
        { withCredentials: true }
      );
      
      if (response.data.success) {
        // Update with server response
        setLikeCount(response.data.likes);
        setDislikeCount(response.data.dislikes);
        setIsLiked(response.data.hasLiked);
        setIsDisliked(response.data.hasDisliked);

        // Notify parent of the update
        if (onUpdate) {
          onUpdate(_id, {
            likes: response.data.likes,
            dislikes: response.data.dislikes,
            hasLiked: response.data.hasLiked,
            hasDisliked: response.data.hasDisliked
          });
        }
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(isLiked);
      setIsDisliked(isDisliked);
      setLikeCount(likeCount);
      setDislikeCount(dislikeCount);
      toast.error('Error updating like');
    }
  };

  const handleDislike = async (e) => {
    e.stopPropagation(); // Prevent entry click event
    try {
      // Optimistically update UI
      const willBeDisliked = !isDisliked;
      setIsDisliked(willBeDisliked);
      if (isLiked) {
        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
      }
      setDislikeCount(prev => willBeDisliked ? prev + 1 : Math.max(0, prev - 1));

      const response = await axios.post(
        `http://localhost:4000/api/entries/${_id}/dislike`,
        {},
        { withCredentials: true }
      );
      
      if (response.data.success) {
        // Update with server response
        setLikeCount(response.data.likes);
        setDislikeCount(response.data.dislikes);
        setIsLiked(response.data.hasLiked);
        setIsDisliked(response.data.hasDisliked);

        // Notify parent of the update
        if (onUpdate) {
          onUpdate(_id, {
            likes: response.data.likes,
            dislikes: response.data.dislikes,
            hasLiked: response.data.hasLiked,
            hasDisliked: response.data.hasDisliked
          });
        }
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(isLiked);
      setIsDisliked(isDisliked);
      setLikeCount(likeCount);
      setDislikeCount(dislikeCount);
      toast.error('Error updating dislike');
    }
  };

  const handleEntryClick = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/entries/${_id}?view=true`,
        { withCredentials: true }
      );
      
      if (response.data) {
        setViews(response.data.viewCount);
        // Update parent if needed
        if (onUpdate) {
          onUpdate(_id, { viewCount: response.data.viewCount });
        }
      }
      
      navigate(`/entry/${_id}?view=true`);
    } catch (error) {
      console.error('Error updating view count:', error);
      navigate(`/entry/${_id}?view=true`);
    }
  };

  return (
    <div className="entry" onClick={handleEntryClick}>
      <div className="entry-header">
        <h3 className="entry-title">{title}</h3>
        <span className="entry-username">@{username}</span>
      </div>
      <p className="entry-content">{content}</p>
      <div className="entry-actions">
        <div className="action-group">
          <button 
            className={`action-button ${isLiked ? 'active' : ''}`} 
            onClick={handleLike}
          >
            {isLiked ? <ThumbUpAlt /> : <ThumbUpOffAlt />}
            <span>{likeCount}</span>
          </button>
          <button 
            className={`action-button ${isDisliked ? 'active' : ''}`} 
            onClick={handleDislike}
          >
            {isDisliked ? <ThumbDownAlt /> : <ThumbDownOffAlt />}
            <span>{dislikeCount}</span>
          </button>
          <button className="action-button">
            <Visibility />
            <span>{views}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Entry;