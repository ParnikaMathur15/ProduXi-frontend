import { useEffect, useState } from "react";

export default function AverageScores({ userId }) {
    const [health_avg, setHealthAvg] = useState(null);
    const [prod_avg, setProdAvg] = useState(null);

    const getTColor = (score) => {
        if (score >= 75) return "lime-300"; 
        if (score >= 50) return "amber-300"; 
        if (score >= 25) return "amber-600"; 
        return "rose-500"; 
    };

    useEffect(() => {
        if (!userId) return;

        setHealthAvg(null);
        setProdAvg(null);

        fetch(`http://127.0.0.1:8000/avg-scores?user_id=${userId}`)
            .then(res => res.json())
            .then(data => {
                setHealthAvg(data.health_avg);
                setProdAvg(data.productivity_avg);
            })
            .catch(console.error);
    }, [userId]);

    return (
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-8 sm:gap-12 mb-10">
            <div className="bg-dark_purple shadow-xl border border-gray-200 rounded-xl p-5 sm:p-6 w-full sm:w-64 md:w-72 text-center transition-shadow hover:shadow-2xl">
                <h4 className="font-semibold text-lg sm:text-xl text-cream mb-2">Your Average Health Score</h4>
                <p className={`${health_avg !== null ? "text-3xl sm:text-4xl md:text-5xl font-extrabold" : "text-sm font-thin text-gray-400"} ${health_avg !== null ? `text-${getTColor(health_avg)}` : ""}`}>
                    {health_avg !== null ? health_avg : "Calculating..."}
                </p>
            </div>

            <div className="bg-dark_purple shadow-xl border border-gray-200 rounded-xl p-5 sm:p-6 w-full sm:w-64 md:w-72 text-center transition-shadow hover:shadow-2xl">
                <h4 className="font-semibold text-lg sm:text-xl text-cream mb-2">Your Average Predicted Productivity</h4>
                <p className={`${prod_avg !== null ? "text-3xl sm:text-4xl md:text-5xl font-extrabold" : "text-sm font-thin text-gray-400"} ${prod_avg !== null ? `text-${getTColor(prod_avg)}` : ""}`}>
                    {prod_avg !== null ? prod_avg : "Calculating..."}
                </p>
            </div>
        </div>


    );
}
