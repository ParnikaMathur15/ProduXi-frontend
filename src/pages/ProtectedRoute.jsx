import { useUser } from "./UserContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user } = useUser();

  if (user === undefined) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-light_purple">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-peach mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/" />;
}