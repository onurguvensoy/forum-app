import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";

const socket = io("http://localhost:4000");

function Chat() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const { data: userData } = await axios.get("http://localhost:4000/getusername", {
          withCredentials: true,
        });

        if (userData.status) {
          setUsername(userData.username);
        } else {
          toast.error("Failed to fetch username", { theme: "dark" });
        }

    
        const { data: messagesData } = await axios.get("http://localhost:4000/getmessages");
        setMessages(messagesData); 
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error loading chat data", { theme: "dark" });
      }
    };

    fetchData();


    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => socket.off("message");
  }, []);

  const sendMessage = async () => {
    const newMessage = {
      content: message,
      timestamp: new Date().toISOString(),
      type: "sent",
    };
  
    try {
      const token = localStorage.getItem("token"); 
      await axios.post("http://localhost:4000/savemessages", newMessage, {
        headers: { Authorization: `Bearer ${token}` }, 
      });
      setMessages((prev) => [...prev, newMessage]); 
      setMessage(""); 
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Community Chat</h3>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.type === "sent" ? "sent" : "received"}`}
          >
            <p>{msg.content}</p>
            <span className="timestamp">
              {username} {msg.timestamp}
            </span>
          </div>
        ))}
      </div>

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
}

export default Chat;
