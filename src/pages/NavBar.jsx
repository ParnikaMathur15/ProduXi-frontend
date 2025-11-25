import { Link, useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import { logout } from "../authService";
import { useState } from "react";

export default function Navbar({ setShowModal, setIsLogin, setRedirectAfterLogin, setAuthMessage }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleDashboardClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (user) {
      navigate("/dashboard");
    } else {
      setIsLogin(true);
      setShowModal(true);
      setRedirectAfterLogin("/dashboard");
      setAuthMessage("Please log in to access your dashboard.");
    }
  };

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  return (
    <nav className="w-full mt-0.5 top-0 left-1/2 transform -translate-x-1/2 px-4 sm:px-5 py-3 flex items-center justify-between fixed z-50 rounded-2xl sm:rounded-3xl shadow-lg bg-dark_purple max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-6xl">

      <div className="flex items-center">
        <div className="mr-24 font-semibold text-base sm:text-lg text-white whitespace-nowrap">
          ProduXi
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-20">
        <Link to="/" className="text-white hover:font-bold hover:text-lg transition">
          Home
        </Link>

        <button onClick={handleDashboardClick} className="text-white hover:font-bold hover:text-lg transition">
          Dashboard
        </button>
      </div>

      <div className="hidden lg:flex items-center gap-4">
        {!user ? (
          <>
            <button
              onClick={() => {
                setIsLogin(true);
                setShowModal(true);
              }}
              className="nbtn bg-cream text-dark_purple hover:bg-[#e5b8a4] rounded-lg px-4 py-2"
            >
              Login
            </button>

            <button
              onClick={() => {
                setIsLogin(false);
                setShowModal(true);
              }}
              className="nbtn border border-cream text-cream hover:bg-[#EFB8C8]/10 rounded-lg px-4 py-2"
            >
              Sign Up
            </button>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="nbtn bg-cream text-dark_purple hover:bg-[#e5b8a4] rounded-lg px-4 py-2"
          >
            Logout
          </button>
        )}
      </div>

      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden text-white text-xl"
      >
        <i className={`fas fa-${mobileMenuOpen ? "times" : "bars"}`}></i>
      </button>

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-dark_purple rounded-lg mt-2 p-4 md:hidden shadow-lg border border-peach/20">
          <div className="flex flex-col gap-4">
            <Link
              to="/"
              className="nbtn text-white hover:text-peach transition text-center w-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>

            <button
              onClick={handleDashboardClick}
              className="nbtn text-white hover:font-semibold transition text-center w-full"
            >
              Dashboard
            </button>

            {user ? (
              <button
                onClick={handleLogout}
                className="nbtn text-white hover:text-cream transition bg-peach/20 rounded-lg px-4 py-2 w-full"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsLogin(true);
                  setShowModal(true);
                }}
                className="nbtn text-white hover:text-cream transition bg-light_purple rounded-lg px-4 py-2 w-full"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      )}
    </nav>

  );
}
