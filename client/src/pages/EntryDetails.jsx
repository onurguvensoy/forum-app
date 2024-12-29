import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import Entry from '../components/Entry';
import './EntryDetails.css';

const EntryDetails = () => {
  const { id } = useParams();
  const [entry, setEntry] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/entries/${id}`,
          { withCredentials: true }
        );
        setEntry(response.data);
        setReplies(response.data.replies || []);
      } catch (error) {
        console.error('Error fetching entry:', error);
        toast.error('Error loading entry');
      }
    };

    fetchEntry();
  }, [id]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) {
      toast.error('Reply content is required');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:4000/api/entries/${id}/reply`,
        { content: replyContent },
        { withCredentials: true }
      );

      if (response.data.success) {
        setReplies([...replies, response.data.reply]);
        setReplyContent('');
        toast.success('Reply added successfully');
      }
    } catch (error) {
      toast.error('Error adding reply');
    }
  };

  const handleEntryUpdate = (entryId, newState) => {
    setEntry(prev => ({
      ...prev,
      ...newState
    }));
  };

  return (
    <Layout>
      <div className="entry-details-container">
        {entry ? (
          <>
            <Entry {...entry} onUpdate={handleEntryUpdate} isDetailView={true} />
            
            <div className="reply-section">
              <form onSubmit={handleReplySubmit} className="reply-form">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  minLength={1}
                  maxLength={1000}
                  required
                  rows={3}
                />
                <button type="submit">Reply</button>
              </form>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </Layout>
  );
};

export default EntryDetails; 