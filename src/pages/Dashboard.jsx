import { listenForAuth } from "../authService";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AverageScores from "../components/AverageScores";
import MasterChart from "../components/MasterChart";
import WSummaryBlock from "../components/WSummaryBlock";

export default function Dashboard() {
  const [user, setUser] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = listenForAuth((authUser) => {
      setUser(authUser);
      if (!authUser) navigate("/");
    });
    return () => unsubscribe();
  }, []);

  if (user === undefined) return null;

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-light_purple py-8">
      <h2 className="text-peach text-xl sm:text-2xl lg:text-3xl font-semibold text-center mb-6 sm:mb-8 mt-14 sm:mt-12 px-2 animate-fadeIn">
        {user.displayName || user.email.split("@")[0]}, have a look at your logging history!
      </h2>

      <div className="bg-[#F8F4E8] shadow-[0_0_20px_rgba(255,240,220,0.2)] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 w-full max-w-6xl border border-gray-100/50 text-[#2E1A2C] space-y-6 sm:space-y-8">
        <div className="w-full animate-fadeIn">
          <AverageScores userId={user.uid} />
        </div>
        <div className="w-full animate-fadeIn">
          <MasterChart userId={user.uid} />
        </div>
        <div className="w-full animate-fadeIn">
          <WSummaryBlock userId={user.uid} />
        </div>

      </div>
    </div>
  );
}