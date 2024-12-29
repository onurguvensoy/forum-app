import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Visibility,
  ThumbUpAlt,
  ThumbDownAlt
} from '@mui/icons-material';
import './Trends.css';

const Trends = () => {
  const [trendingEntries, setTrendingEntries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrendingEntries = async () => {
      try {
        const response = await axios.get('https://forum-app-frontend-om3r.onrender.com//api/entries/trending');
        setTrendingEntries(response.data);
      } catch (error) {
        console.error('Error fetching trending entries:', error);
      }
    };

    fetchTrendingEntries();
    const interval = setInterval(fetchTrendingEntries, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  const handleEntryClick = (id) => {
    navigate(`/entry/${id}?view=true`);
  };

  const handleEntryUpdate = (entryId, newState) => {
    setTrendingEntries(prevEntries => 
      prevEntries.map(entry => 
        entry._id === entryId 
          ? { ...entry, likes: newState.likes, dislikes: newState.dislikes }
          : entry
      )
    );
  };

  return (
    <div className="trends-container">
      <h2 className="trends-title">Trending Entries</h2>
      <div className="trending-entries">
        {trendingEntries.map((entry) => (
          <div
            key={entry._id}
            className="trending-entry"
            onClick={() => handleEntryClick(entry._id)}
          >
            <div className="trending-entry-content">
              <h3 className="trending-entry-title">{entry.title}</h3>
              <span className="trending-entry-username">@{entry.username}</span>
            </div>
            <div className="trending-entry-stats">
              <div className="stat-item">
                <Visibility />
                <span>{entry.viewCount}</span>
              </div>
              <div className="stat-item">
                <ThumbUpAlt />
                <span>{entry.likes}</span>
              </div>
              <div className="stat-item">
                <ThumbDownAlt />
                <span>{entry.dislikes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trends;
