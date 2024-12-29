import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EntryDetails from "./pages/EntryDetails";
import CommunityChat from "./pages/CommunityChat";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <div>
        <ToastContainer position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/entry/:id" element={
            <ProtectedRoute>
              <EntryDetails />
            </ProtectedRoute>
          } />
          <Route path="/community-chat" element={
            <ProtectedRoute>
              <CommunityChat />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;