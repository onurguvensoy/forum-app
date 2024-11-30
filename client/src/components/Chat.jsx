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
    const fetchUsername = async () => {
        try {
          const { data } = await axios.get("http://localhost:4000/getusername", {
            withCredentials: true, 
          });
  
          if (data.status) {
            setUsername(data.username); 
          } else {
            console.error("Failed to fetch username");
            toast.error("Failed to fetch username", { theme: "dark" });
          }
        } catch (error) {
          console.error("Error fetching username:", error);
          toast.error("Error fetching username", { theme: "dark" });
        }
      };
  
      fetchUsername();
    
    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]); 
    });


    return () => socket.off("message");
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        content: message,
        timestamp: new Date().toLocaleTimeString(),
        type: "sent", 
      };
      socket.emit("message", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]); 
      setMessage(""); 
    
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
            <span className="timestamp">{username} {msg.timestamp}</span>
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
