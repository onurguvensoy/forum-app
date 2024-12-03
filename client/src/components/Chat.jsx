import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useUser } from "../utils/UserContext";

const Chat = () => {
  const { username } = useUser(); 
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socketRef.current = io("http://localhost:4000");

    const fetchMessages = async () => {
      try {
        const { data: messagesData } = await axios.get("http://localhost:4000/getmessages");
        setMessages(messagesData);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Unable to load messages. Please try again later.");
      }
    };
    fetchMessages();
    socketRef.current.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      scrollToBottom();
    });
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);
  const sendMessage = async () => {
    if (!message.trim()) return; 
     const newMessage = {
      content: message,
      timestamp: new Date().toISOString(),
      username,
    };
    try {
      await axios.post("http://localhost:4000/savemessages", newMessage); 
      socketRef.current.emit("message", newMessage); 
      setMessages((prev) => [...prev, newMessage]);
      setMessage(""); 
      scrollToBottom();
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Message could not be sent. Please try again.");
    }
  };
  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Community Chat</h3>
      </div>
      <div className="chat-messages">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.username === username ? "sent" : "received"}`}
            >
              <p>{msg.content}</p>
              <span className="timestamp">
                {msg.username} • {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        ) : (
          <p>No messages yet. Be the first to start the conversation!</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && <div className="chat-error">{error}</div>}
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
