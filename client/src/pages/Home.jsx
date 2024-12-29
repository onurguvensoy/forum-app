import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import Entries from "../components/Entries";
import { useUser } from "../utils/userProvider";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const { setUsername } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (!cookies.token) {
        navigate("/login");
        return;
      }

      try {
        const { data } = await axios.post(
          "http://localhost:4000/api/auth/verify",
          {},
          { 
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${cookies.token}`
            }
          }
        );

        if (!data.status) {
          removeCookie("token");
          navigate("/login");
        }
      } catch (error) {
        removeCookie("token");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, [cookies, navigate, removeCookie]);

  useEffect(() => {
    const fetchUsername = async () => {
      if (!cookies.token) return;

      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/auth/getusername",
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${cookies.token}`
            }
          }
        );

        if (data.status) {
          setUsername(data.username);
        } else {
          toast.error("Failed to fetch username", {
            theme: "dark",
            style: {
              backgroundColor: "#1a1a1a",
              border: "1px solid #dc2626",
              borderRadius: "4px",
              color: "#ffffff",
            }
          });
        }
      } catch (error) {
        toast.error("Error fetching user data", {
          theme: "dark",
          style: {
            backgroundColor: "#1a1a1a",
            border: "1px solid #dc2626",
            borderRadius: "4px",
            color: "#ffffff",
          }
        });
      }
    };

    fetchUsername();
  }, [cookies.token, setUsername]);

  if (isLoading) {
    return (
      <div className="loading-wrapper">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <Layout>
      <Entries />
    </Layout>
  );
};

export default Home;