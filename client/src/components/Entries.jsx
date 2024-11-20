import React,{useState,useEffect} from 'react';
import Entry from "./Entry";
const Entries = () => {
  const [entries, setEntries] = useState([]);
  return (
    <div>
  
      {entries.map((entry) => (
        <Entry key={entry.$oid} title={entry.title} content={entry.content} />
      ))}
    </div>
  );
};
export default Entries;