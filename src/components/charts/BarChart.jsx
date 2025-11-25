import { useEffect, useState } from "react";

export default function BarChart({ userId }) {
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const [base64, setBase64] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    fetch(`${API_URL}/chart/bar?user_id=${userId}`)
      .then(res => res.json())
      .then(data => setBase64(data.chart))
      .catch(err => setError(err.message));
  }, [userId]);

  return (
    <div className="max-w-lg">
      <h3 className="text-center text-lg font-semibold mb-3">
        Latest Well-being Breakdown
      </h3>
      {error ? (
        <p className="text-red-600 text-center">Bar chart failed to load.</p>
      ) : base64 ? (
        <img
          src={`data:image/png;base64,${base64}`}
          alt="Bar Chart"
          className="w-full rounded-xl border"
        />
      ) : (
        <p className="text-center">Loading...</p>
      )}
    </div>
  );
}
