import React, { useState, useEffect } from "react";
import Entry from "./Entry";
import axios from "axios";
import { toast } from "react-toastify";
import "./Entries.css";

const Entries = () => {
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/entries");
        const data = await response.json();
        setEntries(data);
      } catch (error) {
        console.error("Error fetching entries:", error);
      }
    };

    fetchEntries();
  }, []);

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
        setTitle("");
        setContent("");
        // Refresh entries after creating new one
        const updatedResponse = await fetch("http://localhost:4000/api/entries");
        const updatedData = await updatedResponse.json();
        setEntries(updatedData);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error creating entry';
      toast.error(errorMessage);
    }
  };

  const handleEntryUpdate = (entryId, newState) => {
    setEntries(prevEntries => 
      prevEntries.map(entry => 
        entry._id === entryId 
          ? { ...entry, likes: newState.likes, dislikes: newState.dislikes }
          : entry
      )
    );
  };

  return (
    <div className="entries-container">
      <div className="create-entry-compact">
        <form onSubmit={handleSubmit} className="create-entry-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            minLength={5}
            maxLength={100}
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            minLength={20}
            maxLength={5000}
            required
            rows={3}
          />
          <div className="form-actions">
            <button type="submit">Post</button>
          </div>
        </form>
      </div>
      
      {entries.length > 0 ? (
        entries.map((entry) => (
          <Entry
            key={entry._id}
            {...entry}
            onUpdate={handleEntryUpdate}
          />
        ))
      ) : (
        <p>Loading Please Wait...</p>
      )}
    </div>
  );
};

export default Entries;
