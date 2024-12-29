import React, { useState, useEffect, useRef } from 'react';
import { Send } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useUser } from '../utils/userProvider';
import Layout from '../components/Layout';
import './CommunityChat.css';

const CommunityChat = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['token']);
  const { username, setUsername } = useUser();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const verifyUser = async () => {
      if (!cookies.token) {
        navigate("/login");
        return;
      }

      try {
        // First verify the token
        const { data } = await axios.post(
          "http://localhost:4000/api/auth/verify",
          {},
          { withCredentials: true }
        );

        if (!data.status) {
          navigate("/login");
          return;
        }

        // Then get the username
        const usernameResponse = await axios.get(
          "https://forum-app-frontend-om3r.onrender.com//api/users/me",
          { withCredentials: true }
        );

        if (usernameResponse.data) {
          setUsername(usernameResponse.data.username);
          fetchMessages();
          const interval = setInterval(fetchMessages, 5000);
          return () => clearInterval(interval);
        }
      } catch (error) {
        console.error('Verification error:', error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, [cookies.token, navigate, setUsername]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get('http://localhost:4000/api/chat/messages', {
        withCredentials: true
      });
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      if (!messages.length) {
        toast.error('Failed to load messages', {
          theme: 'dark'
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    try {
      const { data } = await axios.post(
        'https://forum-app-frontend-om3r.onrender.com/api/chat/messages',
        { 
          content: messageInput,
          timestamp: new Date().toISOString()
        },
        { withCredentials: true }
      );

      if (data.success) {
        setMessages(prev => [...prev, data.data]);
        setMessageInput('');
      } else {
        toast.error('Failed to send message', {
          theme: 'dark'
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message', {
        theme: 'dark'
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="chat-container">
          <div className="loading-wrapper">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="chat-container">
        <div className="chat-header">
          <h2>Community Chat</h2>
          <div className="online-users">
            <div className="online-dot"></div>
            <span>Online</span>
          </div>
        </div>

        <div className="messages-container" ref={messagesContainerRef}>
          {messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message._id}
                className={`message ${message.username === username ? 'own-message' : ''}`}
              >
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-username">@{message.username}</span>
                    <span className="message-time">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="message-text">{message.content}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-messages">
              No messages yet. Start the conversation!
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="message-form">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            maxLength={500}
          />
          <button type="submit" className="send-button" disabled={!messageInput.trim()}>
            <Send />
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CommunityChat;