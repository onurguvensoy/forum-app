import { useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import MuiNavbar from "../components/MuiNavbar";
import Sidebar from "../components/MuiSidebar";
import Entries from "../components/Entries";
import { useUser } from "../utils/userProvider";
const Home = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const {setUsername } = useUser();

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
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/");
      }
      const { data } = await axios.post(
        "http://localhost:4000",
        {accessToken: cookies.token},
        { withCredentials: true }
      );
      const { status, user } = data;
      return status
        ? toast(`Hello ${user}`, {
            position: "top-right",
            autoClose: 2000,
            closeButton: false,
            hideProgressBar: true,
            theme: "dark",
          })
        : (removeCookie("token"), navigate("/login"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);
  return (
    <div>
      <div>
        <MuiNavbar></MuiNavbar>
      </div>
      <div className="hero">
      <div className="sidebar">
        <Sidebar></Sidebar>
      </div>
      <div className="content">
      <div className="entries">
      <Entries/>
      </div>
      </div>
      </div>

    </div>
  );
};

export default Home;