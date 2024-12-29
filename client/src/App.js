import { Route, Routes } from "react-router-dom";
import { CreateEntry, Login, Signup, Home, EntryDetail, CommunityChat } from "./pages";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        closeButton={false}
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        theme="dark"
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/create-entry" element={
          <ProtectedRoute>
            <CreateEntry />
          </ProtectedRoute>
        } />
        <Route path="/community-chat" element={
          <ProtectedRoute>
            <CommunityChat />
          </ProtectedRoute>
        } />
        <Route path="/entries/:id" element={
          <ProtectedRoute>
            <EntryDetail />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;