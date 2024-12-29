import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { Avatar } from '@mui/material';
import { Send } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import './CommunityChat.css';

const CommunityChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/auth/getusername', { withCredentials: true });
        setUsername(response.data.username);
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      // Here you would typically send the message to your backend
      // For now, we'll just add it to the local state
      const newMsg = {
        id: Date.now(),
        username,
        content: newMessage,
        timestamp: new Date(),
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    } catch (error) {
      toast.error('Error sending message');
    }
  };

  return (
    <Layout>
      <div className="chat-container">
        <div className="chat-header">
          <h2>Community Chat</h2>
          <div className="online-users">
            <span className="online-dot"></span>
            <span>125 online</span>
          </div>
        </div>
        
        <div className="messages-container">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`message ${message.username === username ? 'own-message' : ''}`}
            >
              <Avatar className="message-avatar">
                {message.username[0].toUpperCase()}
              </Avatar>
              <div className="message-content">
                <div className="message-header">
                  <span className="message-username">{message.username}</span>
                  <span className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p>{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="message-form">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            maxLength={500}
          />
          <button type="submit">
            <Send />
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CommunityChat;