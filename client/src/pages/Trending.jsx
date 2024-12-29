import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import Entry from "../components/Entry";
import "./Trending.css";

const Trending = () => {
  const [trendingEntries, setTrendingEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingEntries = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/entries/trending",
          { withCredentials: true }
        );
        setTrendingEntries(data);
        if (data.length === 0) {
          toast.info("No trending entries found yet", {
            theme: "dark",
            style: {
              backgroundColor: "#1a1a1a",
              border: "1px solid #3b82f6",
              borderRadius: "4px",
              color: "#ffffff",
            }
          });
        }
      } catch (error) {
        toast.error("Failed to fetch trending entries", {
          theme: "dark",
          style: {
            backgroundColor: "#1a1a1a",
            border: "1px solid #dc2626",
            borderRadius: "4px",
            color: "#ffffff",
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingEntries();
  }, []);

  const handleEntryUpdate = (entryId, newState) => {
    setTrendingEntries(prevEntries => 
      prevEntries.map(entry => 
        entry._id === entryId 
          ? { ...entry, ...newState }
          : entry
      )
    );
  };

  if (isLoading) {
    return (
      <div className="loading-wrapper">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="entries-container">
        <h1 className="trending-title">Trending Entries</h1>
        {trendingEntries.length > 0 ? (
          trendingEntries.map((entry, index) => (
            <Entry
              key={entry._id}
              {...entry}
              onUpdate={handleEntryUpdate}
            />
          ))
        ) : (
          <div className="no-entries">
            No trending entries yet. Be the first to create a popular entry!
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Trending; 