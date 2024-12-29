import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from 'axios';
import { toast } from 'react-toastify';
import './CreateEntry.css';

const CreateEntry = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:4000/api/entries',
        { title, content },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Entry created successfully');
        navigate(`/entries/${response.data.entry._id}`);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error creating entry';
      toast.error(errorMessage);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  return (
    <Layout>
      <div className="entry">
        <h2>Create New Entry</h2>
        <form onSubmit={handleSubmit} className="entry-form">
          <div className="form-group">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title..."
              minLength={5}
              maxLength={100}
              required
              className="entry-title-input"
            />
            <small>{title.length}/100 characters</small>
          </div>

          <div className="form-group">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your entry content..."
              minLength={20}
              maxLength={5000}
              required
              rows={10}
              className="entry-content-input"
            />
            <small>{content.length}/5000 characters</small>
          </div>

          <button 
            type="submit"
            className="entry-submit-button"
            disabled={!title.trim() || !content.trim()}
          >
            Create Entry
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CreateEntry;