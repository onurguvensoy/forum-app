import React, {useState,useEffect} from 'react'


const Entry = () => {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
      const fetchEntries = async () => {
        try {
          const response = await fetch('https://localhost:4000/entry'); 
          const data = await response.json();
          setEntries(data);
        } catch (error) {
          console.error('Error fetching entries:', error);
        }
      };
  
      fetchEntries();
    }, []);
  
    return (
        <div className="entry">
            {entries.length > 0 ? (
                entries.map((entry) => (
                    <div key={entry.$oid}>
                        <h3>{entry.title}</h3>
                        <p>{entry.content}</p>
                    </div>
                ))
            ) : (
                <p>No entries found.</p>
            )}
        </div>
        );
    }

export default Entry