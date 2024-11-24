import React, { useState, useEffect } from "react";
import Entry from "./Entry";

const Entries = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch("http://localhost:4000/entries");
        const data = await response.json();
        setEntries(data);
      } catch (error) {
        console.error("Error fetching entries:", error);
      }
    };

    fetchEntries();
  }, [entries]);

  return (
    <div>
      {entries.length > 0 ? (
        entries.map((entry) => (
          <Entry
            _id={entry._id}
            title={entry.title}
            content={entry.content}
            username={entry.username}
          />
        
        ))
      ) : (
        <p>No entries available</p>
      )}
    </div>
  );
};

export default Entries;
