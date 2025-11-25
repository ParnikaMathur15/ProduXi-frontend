import { useEffect, useState } from "react";

export default function WSummaryBlock({ userId }) {
    const [ws, setWS] = useState([]);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/week_summary?user_id=${userId}`)
            .then(res => res.json())
            .then(data => {setWS(data.ws);})
            .catch(console.error);
    }, [userId]);

    return (
        <div className="bg-dark_purple shadow-xl border border-gray-200 rounded-xl p-6 mt-12 transition-shadow hover:shadow-2xl">
            <h4 className="font-semibold text-2xl text-center text-cream mb-3">Weekly Summary</h4>
            <ul className="list-disc list-inside space-y-2 pl-4 text-base font-normal text-cream mb-2">
                {ws.length !== 0 ? 
                    (ws.map((item, index) => (<li key={index}>{item}</li>)))
                    : ("Fetching...")}
            </ul>
        </div>
    );
}
