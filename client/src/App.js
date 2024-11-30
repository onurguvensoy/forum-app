import { Route, Routes } from "react-router-dom";
import { CreateEntry, Login, Signup,Home,EntryDetail,CommunityChat } from "./pages";
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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/CreateEntry" element={<CreateEntry />} />
        <Route path="/CommunityChat" element={<CommunityChat />} />
        <Route path="/entries/:id" element={<EntryDetail/>} />

      </Routes>
    </div>
  );
}

export default App;