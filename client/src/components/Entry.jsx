import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  ThumbUpAlt, 
  ThumbDownAlt, 
  Visibility, 
  ThumbUpOffAlt,
  ThumbDownOffAlt,
  ChatBubbleOutline
} from '@mui/icons-material';
import './Entry.css';

const Entry = ({ 
  _id, 
  title, 
  content, 
  username, 
  viewCount = 0, 
  likes = 0, 
  dislikes = 0, 
  hasLiked = false, 
  hasDisliked = false, 
  replies = [], 
  onUpdate,
  isDetailView = false
}) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(hasLiked);
  const [isDisliked, setIsDisliked] = useState(hasDisliked);
  const [likeCount, setLikeCount] = useState(likes);
  const [dislikeCount, setDislikeCount] = useState(dislikes);
  const [views, setViews] = useState(viewCount);
  const [showReplies, setShowReplies] = useState(isDetailView);
  const [replyContent, setReplyContent] = useState('');
  const [entryReplies, setEntryReplies] = useState(replies || []);

  // Update state when props change
  useEffect(() => {
    setIsLiked(hasLiked);
    setIsDisliked(hasDisliked);
    setLikeCount(likes);
    setDislikeCount(dislikes);
    setViews(viewCount);
    setEntryReplies(replies || []);
  }, [hasLiked, hasDisliked, likes, dislikes, viewCount, replies]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent entry click event

    if (!replyContent.trim()) {
      toast.error('Reply content is required');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:4000/api/entries/${_id}/reply`,
        { content: replyContent },
        { withCredentials: true }
      );

      if (response.data.success) {
        const newReply = response.data.reply;
        setEntryReplies(prev => [...prev, newReply]);
        setReplyContent('');
        toast.success('Reply added successfully');

        // Notify parent of the update
        if (onUpdate) {
          onUpdate(_id, { replies: [...entryReplies, newReply] });
        }
      }
    } catch (error) {
      toast.error('Error adding reply');
    }
  };

  const toggleReplies = (e) => {
    e.stopPropagation(); // Prevent entry click event
    setShowReplies(!showReplies);
  };

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
      
      navigate(`/entry/${_id}`);
    } catch (error) {
      console.error('Error updating view count:', error);
      navigate(`/entry/${_id}`);
    }
  };

  const handleUsernameClick = (e, clickedUsername) => {
    e.stopPropagation(); // Prevent entry click event
    navigate(`/profile/${clickedUsername}`);
  };

  return (
    <div className="entry" onClick={!isDetailView ? handleEntryClick : undefined}>
      <div className="entry-header">
        <h3 className="entry-title">{title}</h3>
        <span 
          className="entry-username clickable" 
          onClick={(e) => handleUsernameClick(e, username)}
        >
          @{username}
        </span>
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
          {!isDetailView && (
            <button 
              className={`action-button ${showReplies ? 'active' : ''}`}
              onClick={toggleReplies}
            >
              <ChatBubbleOutline />
              <span>{entryReplies.length}</span>
            </button>
          )}
        </div>
      </div>

      {showReplies && !isDetailView && (
        <div className="entry-replies" onClick={e => e.stopPropagation()}>
          <div className="replies-list">
            {entryReplies.length > 0 ? (
              entryReplies.map((reply, index) => (
                <div key={reply._id || index} className="reply-item">
                  <div className="reply-header">
                    <span 
                      className="reply-username clickable"
                      onClick={(e) => handleUsernameClick(e, reply.username)}
                    >
                      @{reply.username}
                    </span>
                    <span className="reply-date">
                      {new Date(reply.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="reply-content">{reply.content}</p>
                </div>
              ))
            ) : (
              <p className="no-replies">No replies yet.</p>
            )}
          </div>
          
          <form onSubmit={handleReplySubmit} className="reply-form">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              minLength={1}
              maxLength={1000}
              required
              rows={2}
            />
            <button type="submit">Reply</button>
          </form>
        </div>
      )}

      {isDetailView && (
        <div className="replies-list">
          {entryReplies.length > 0 ? (
            entryReplies.map((reply, index) => (
              <div key={reply._id || index} className="reply-item">
                <div className="reply-header">
                  <span 
                    className="reply-username clickable"
                    onClick={(e) => handleUsernameClick(e, reply.username)}
                  >
                    @{reply.username}
                  </span>
                  <span className="reply-date">
                    {new Date(reply.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="reply-content">{reply.content}</p>
              </div>
            ))
          ) : (
            <p className="no-replies">No replies yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Entry;