import { useEffect, useState } from "react";

export default function FImpChart({ userId }) {
  const [base64, setBase64] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    fetch(`http://127.0.0.1:8000/chart/bmap_chart?user_id=${userId}`)
      .then(res => res.json())
      .then(data => setBase64(data.chart))
      .catch(err => setError(err.message));
  }, [userId]);

  return (
    <div className="max-w-lg">
      <h3 className="text-center text-lg font-semibold mb-3">
        Track your behavior
      </h3>

      {error ? (
        <p className="text-red-600 text-center">
          Chart failed to load.
        </p>
      ) : base64 === null ? (
        <p className="text-center">Loading...</p>
      ) : base64 ? (
        <img
          src={`data:image/png;base64,${base64}`}
          alt="Feature Impact Chart"
          className="w-full rounded-xl border mb-3"
        />
      ) : (
        <p className="text-center text-gray-600">
          No chart data available.
        </p>
      )}
    </div>
  );
}
