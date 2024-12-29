import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import Entry from '../components/Entry';
import './Profile.css';

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [userEntries, setUserEntries] = useState([]);
  const [userReplies, setUserReplies] = useState([]);
  const [activeTab, setActiveTab] = useState('entries');
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch user info
        const userResponse = await axios.get(
          `http://localhost:4000/api/users/${username}`,
          { withCredentials: true }
        );
        
        if (!userResponse.data) {
          setError('User not found');
          return;
        }
        
        setUserInfo(userResponse.data);

        // Fetch user's entries
        const entriesResponse = await axios.get(
          `http://localhost:4000/api/entries/user/${username}`,
          { withCredentials: true }
        );
        setUserEntries(entriesResponse.data);

        // Fetch user's replies
        const repliesResponse = await axios.get(
          `http://localhost:4000/api/entries/replies/${username}`,
          { withCredentials: true }
        );
        setUserReplies(repliesResponse.data);

      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response?.status === 404) {
          setError('User not found');
          toast.error('User not found', {
            theme: "dark",
            style: {
              backgroundColor: "#1a1a1a",
              border: "1px solid #dc2626",
              borderRadius: "4px",
              color: "#ffffff",
            }
          });
        } else {
          setError('Failed to fetch user data');
          toast.error('Failed to fetch user data', {
            theme: "dark",
            style: {
              backgroundColor: "#1a1a1a",
              border: "1px solid #dc2626",
              borderRadius: "4px",
              color: "#ffffff",
            }
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  const handleEntryUpdate = (entryId, newState) => {
    if (activeTab === 'entries') {
      setUserEntries(prevEntries => 
        prevEntries.map(entry => 
          entry._id === entryId 
            ? { ...entry, ...newState }
            : entry
        )
      );
    } else {
      setUserReplies(prevEntries => 
        prevEntries.map(entry => 
          entry._id === entryId 
            ? { ...entry, ...newState }
            : entry
        )
      );
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="loading-wrapper">
          <div className="loading-spinner"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="entries-container">
          <div className="error-state">
            <h2>{error}</h2>
            <p>The user you're looking for doesn't exist or something went wrong.</p>
            <button onClick={() => navigate('/')}>Go Home</button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="entries-container">
        <div className="profile-header">
          <h1 className="profile-username">@{username}</h1>
          {userInfo && (
            <div className="profile-info">
              <p className="join-date">Joined {new Date(userInfo.createdAt).toLocaleDateString()}</p>
              <div className="stats">
                <span>{userEntries.length} Entries</span>
                <span>{userReplies.length} Replies</span>
              </div>
            </div>
          )}
        </div>

        <div className="profile-tabs">
          <button 
            className={`tab ${activeTab === 'entries' ? 'active' : ''}`}
            onClick={() => setActiveTab('entries')}
          >
            Entries
          </button>
          <button 
            className={`tab ${activeTab === 'replies' ? 'active' : ''}`}
            onClick={() => setActiveTab('replies')}
          >
            Replies
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'entries' ? (
            userEntries.length > 0 ? (
              userEntries.map(entry => (
                <Entry
                  key={entry._id}
                  {...entry}
                  onUpdate={handleEntryUpdate}
                />
              ))
            ) : (
              <p className="no-content">No entries yet</p>
            )
          ) : (
            userReplies.length > 0 ? (
              userReplies.map(entry => (
                <Entry
                  key={entry._id}
                  {...entry}
                  onUpdate={handleEntryUpdate}
                />
              ))
            ) : (
              <p className="no-content">No replies yet</p>
            )
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile; 