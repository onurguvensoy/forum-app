import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useUser } from "../utils/userProvider";
import { toast } from "react-toastify";
import { filterAllWords, hasMinimumChars, hasExceededCharLimit } from "../utils/wordFilter";

const MIN_MESSAGE_CHARS = 3; // Minimum karakter sınırı
const MAX_MESSAGE_CHARS = 100; // Maksimum karakter sınırı

const Chat = () => {
    const { username, setUsername } = useUser();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView();
    };

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const { data } = await axios.get("http://localhost:4000/getusername", {
                    withCredentials: true,
                });

                if (data.status) {
                    setUsername(data.username);
                } else {
                    toast.error("Failed to fetch username", { theme: "dark" });
                }
            } catch (error) {
                toast.error("Error fetching username", { theme: "dark" });
            }
        };

        fetchUsername();
    }, [setUsername]);

    useEffect(() => {
        socketRef.current = io("http://localhost:4000");

        const fetchMessages = async () => {
            try {
                const { data: messagesData } = await axios.get(
                    "http://localhost:4000/getmessages"
                );
                setMessages(messagesData);
                scrollToBottom();
            } catch (err) {
                console.error("Error fetching messages:", err);
                setError("Unable to load messages. Please try again later.");
            }
        };

        fetchMessages();

        socketRef.current.on("message", (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleMessageChange = (e) => {
        const input = e.target.value;
        const filteredMessage = filterAllWords(input);

        if (hasExceededCharLimit(filteredMessage, MAX_MESSAGE_CHARS)) {
            toast.error("Message exceeds character limit.");
            return;
        }

        setMessage(filteredMessage.substring(0, MAX_MESSAGE_CHARS));
    };

    const sendMessage = async () => {
        if (!message.trim()) return;

        if (!hasMinimumChars(message, MIN_MESSAGE_CHARS)) {
            setError(`Message must have at least ${MIN_MESSAGE_CHARS} characters.`);
            return;
        }

        if (hasExceededCharLimit(message, MAX_MESSAGE_CHARS)) {
            setError(`Message cannot exceed ${MAX_MESSAGE_CHARS} characters.`);
            return;
        }

        const filteredMessage = filterAllWords(message);
        const trimmedMessage = filteredMessage.trim().substring(0, MAX_MESSAGE_CHARS);

        if (!trimmedMessage) return;

        const newMessage = {
            content: trimmedMessage,
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
                                <strong style={{ color: "#ffcc00" }}>{msg.username}</strong> •{" "}
                                {new Date(msg.timestamp).toLocaleTimeString()}
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
                    onChange={handleMessageChange}
                    placeholder="Type your message..."
                />
                <p>{message.length}/{MAX_MESSAGE_CHARS}</p>
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;