import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./pages/NavBar";
import FormPage from "./pages/FormPage";
import Dashboard from "./pages/Dashboard";
import AuthModal from "./components/AuthModal";
import ProtectedRoute from "./pages/ProtectedRoute"; 
import Footer from "./pages/Footer";
import { useState } from "react";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);
  const [authMessage, setAuthMessage] = useState("");
  
  return (
    <Router>
      <NavBar 
        setShowModal={setShowModal}
        setIsLogin={setIsLogin}
        setRedirectAfterLogin={setRedirectAfterLogin}
        setAuthMessage={setAuthMessage} 
      />
      <AuthModal
        showModal={showModal}
        setShowModal={setShowModal}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        redirectAfterLogin={redirectAfterLogin}
        setRedirectAfterLogin={setRedirectAfterLogin}
        message={authMessage}
        />
      <Routes>
        <Route path="/" element={<FormPage />} /> 
        <Route path="/form" element={<FormPage />} />

        {/* Protected Dashboard Route */}
        <Route path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
