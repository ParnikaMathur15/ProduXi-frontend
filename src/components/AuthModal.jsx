import { useState, useEffect } from "react";
import { signUp, login, listenForAuth, googleLogin } from "../authService";
import { useNavigate } from "react-router-dom";

export default function AuthModal({
  showModal,
  setShowModal,
  isLogin,
  setIsLogin,
  redirectAfterLogin,
  setRedirectAfterLogin,
  message
}) {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = listenForAuth(setUser);
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) await login(email, password);
      else await signUp(email, password);

      alert(isLogin ? "Login successful!" : "Signup successful!");

      setShowModal(false);
      setEmail("");
      setPassword("");

      if (redirectAfterLogin) {
        navigate(redirectAfterLogin);
        setRedirectAfterLogin(null);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 px-4">
  <div className="relative bg-[#2f2235] border border-[#51315e] rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-sm md:max-w-md">

    <button
      className="absolute top-4 right-4 text-cream hover:text-[#facab3] transition text-xl sm:text-2xl"
      onClick={() => setShowModal(false)}
    >
      <i className="fa-solid fa-xmark"></i>
    </button>

    {message && (
      <p className="mb-3 text-sm sm:text-base text-cream/80 font-medium text-center">
        {message}
      </p>
    )}

    {/* Title */}
    <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-cream text-center mb-4">
      {isLogin ? "Login" : "Sign Up"}
    </h2>

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-3 py-2 sm:py-3 rounded-lg bg-[#3a2c42] text-cream placeholder-[#bfa7b8] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-peach"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-3 py-2 sm:py-3 rounded-lg bg-[#3a2c42] text-cream placeholder-[#bfa7b8] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-peach"
      />

      <button
        type="submit"
        className="w-full bg-cream text-light_purple font-medium text-base sm:text-lg py-2 sm:py-3 rounded-lg hover:bg-[#f5cfa3] transition"
      >
        {isLogin ? "Login" : "Sign Up"}
      </button>
    </form>

    {/* Google Login */}
    <button
      onClick={async () => {
        try {
          await googleLogin();
          alert("Google login successful!");
          setShowModal(false);
          if (redirectAfterLogin) {
            navigate(redirectAfterLogin);
            setRedirectAfterLogin(null);
          }
        } catch (error) {
          alert("Google Sign-in failed: " + error.message);
        }
      }}
      className="flex gap-3 justify-center items-center w-full mt-3 bg-[#6a4df5] text-white font-medium text-base sm:text-lg py-2 sm:py-3 rounded-lg hover:bg-[#5a3ed1] transition"
    >
      <i className="fa-brands fa-google text-lg sm:text-xl"></i>Sign in with Google
    </button>

    {/* Toggle login/signup */}
    <p
      onClick={() => setIsLogin(!isLogin)}
      className="mt-4 text-center text-sm sm:text-base cursor-pointer text-[#ffdab9]/90 hover:underline"
    >
      {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
    </p>
  </div>
</div>
      )}
    </>
  );
}
