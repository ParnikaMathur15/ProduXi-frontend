import { useState, useEffect } from "react";
import axios from "axios";
import { listenForAuth } from "../authService";
import { v4 as uuidv4 } from "uuid";
import { convertFormValues } from "../valueMappings";

function FormPage() {
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const [focusLevel, setFocusLevel] = useState(3);
  const [moodLevel, setMoodLevel] = useState(3);
  const [overthinkingLevel, setOverthinkingLevel] = useState("Not at all");
  const [stressLevel, setStressLevel] = useState(3);
  const [tasksPlanned, setTasksPlanned] = useState(0);
  const [tasksDone, setTasksDone] = useState(0);
  const [procrastinationLevel, setProcrastinationLevel] = useState("Not at all");
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [napTaken, setNapTaken] = useState("No");
  const [distractions, setDistraction] = useState(0);
  const [exerciseLevel, setExerciseLevel] = useState("None");
  const [hydrationLiters, setHydrationLiters] = useState(2);
  const [junkFoodIntake, setJunkFoodIntake] = useState(1);
  const [outsideFood, setOutsideFood] = useState("No");
  const [energyLevel, setEnergyLevel] = useState(3);
  const [screenTime, setScreenTime] = useState(3);
  const [doomScrollingTime, setDoomScrollingTime] = useState(1);
  const [lastLog, setLastLog] = useState(null);
  const [yesterdayProductivity, setYesterdayProductivity] = useState(50);

  const gen_labels = { 1: "Very Low", 2: "Low", 3: "Moderate", 4: "High", 5: "Very High" };
  const distraction_labels=["None", "Few distractions", "Frequent distractions", "Constant distractions"]
  const sleep_labels = { 1: "Very Poor", 2: "Poor", 3: "Average", 4: "Good", 5: "Very Refreshing" };
  const junk_labels = ["None", "A bit", "A lot", "Way too much"];

  const overthinkingMap = {
    "Not at all": 0,
    "Mild": 1,
    "Often": 2,
    "Obsessively": 3
  };

  const procrastinationMap = {
    "Not at all": 0,
    "A little": 1,
    "Heavily": 2
  };

  const radioMap = { "No": 0, "Yes": 1 };

  const exerciseMap = {
    "None": 0,
    "Light (yoga, cycling)": 1,
    "Heavy (gym/sports)": 2
  };

  const getTColor = (score) => {
    if (score >= 75) return "emerald-500"; 
    if (score >= 50) return "amber-400"; 
    if (score >= 25) return "orange-500"; 
    return "rose-500"; 
  };

  const [user, setUser] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadingMessages = ["Fetching your productivity insights..", "Hang tight! I’m turning your inputs into a productivity story.", "Analyzing your data..Almost there!", "Your summary is coming soon!!",];

  if (!localStorage.getItem("session_id")) {
    localStorage.setItem("session_id", uuidv4());
  }
  const sessionId = localStorage.getItem("session_id");

  useEffect(() => {
    const unsubscribe = listenForAuth(setUser);
    return () => unsubscribe();
  }, []);

  const [summaryData, setSummaryData] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = {
      focus_level: focusLevel,
      mood_level: moodLevel,
      overthinking_level: overthinkingMap[overthinkingLevel],
      stress_level: stressLevel,
      procrastination_level: procrastinationMap[procrastinationLevel],
      sleep_hours: sleepHours,
      sleep_quality: sleepQuality,
      nap_taken: radioMap[napTaken],
      tasks_planned: tasksPlanned,
      tasks_done: tasksDone,
      distractions: distractions,
      exercise_level: exerciseMap[exerciseLevel],
      hydration_liters: hydrationLiters,
      junk_food_intake: junkFoodIntake,
      outside_food: radioMap[outsideFood],
      body_energy: energyLevel,
      screen_time: screenTime,
      doom_scrolling_time: doomScrollingTime,
      productivity_yesterday: yesterdayProductivity
    };

    setSummaryData(formData);

    try {
      const userId = user ? user.uid : sessionId;
      const is_guest=!user;
      const response = await axios.post(`${API_URL}/submit-form/`,{uid:userId, is_guest, form_data:formData});
      setResult(response.data);
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleDownloadPDF = async () => {
    try {
        const payload = {
        form_inputs: convertFormValues(summaryData),            
        health_score: result.health_score,          
        productivity_score: result.predicted_productivity,
        tips: result.tips,
        category_score: result.category_score
        };

        const response = await axios.post(
        `${API_URL}/pdf/form-summary`,
        payload,                    
        { responseType: "blob" }    
        );

        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'ProduXi_Summary.pdf');
        document.body.appendChild(link);

        link.click();
        link.remove();

    } catch (error) {
        console.error("Failed to download PDF:", error);
    }
};

  useEffect(() => {
    const fetchLastLog = async () => {
        if (!user) return; 
        try {
        const response = await axios.get(
            `${API_URL}/last-log?user_id=${user.uid}`
        );
        const log = response.data.last_log;
        setLastLog(log);

        if (log?.productivity != null) {
            setYesterdayProductivity(Math.round(log.productivity));
        } else if (log?.tasks_planned > 0) {
            const computed = (
            (log.tasks_done / log.tasks_planned) * 0.6 +
            (log.focus_level / 5) * 0.2 +
            ((5 - log.stress_level) / 5) * 0.2
            ) * 100;
            setYesterdayProductivity(Math.round(computed));
        } else {
            setYesterdayProductivity(50); 
        }
        } catch (err) {
        console.error("Failed to fetch last log:", err);
        setYesterdayProductivity(50); 
        }
    };

    fetchLastLog();
    }, [user]);


    useEffect(() => {
        if (!loading) return; // stop when not loading
        const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        }, 2000); // every 2 seconds

        return () => clearInterval(interval);
    }, [loading]);


  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-light_purple py-10 px-4">
        <div className="text-center mb-6 mt-12 animate-fadeIn">
            {user ? (
                <h2 className="text-peach text-lg md:text-xl font-semibold">
                    Welcome {user.displayName || user.email.split("@")[0]}, great to have you back!
                </h2>
            ) : (
                <h2 className="text-peach text-lg md:text-xl font-semibold">Welcome, Guest!</h2>
            )}
            <h3 className="text-cream text-2xl md:text-3xl font-bold mt-3 mb-2">How are you feeling today?</h3>
        </div>

        <form
            onSubmit={handleSubmit}
            className="bg-[#F8F4E8] shadow-[0_0_20px_rgba(255,240,220,0.2)] rounded-3xl p-8 md:p-12 w-full max-w-3xl border border-gray-100/50 text-[#2E1A2C]"
        >
            {/* --- FORM CONTENT --- */}
            <div className="space-y-10">
                
                {/* Mind & Focus Section */}
                <section className="border-b border-peach pb-8 text-light_purple animate-fadeIn">
                    <h4 className="font-extrabold text-xl md:text-2xl mb-6 text-dark_purple">🧘 Mind & Focus</h4>
                    <div className="space-y-5">
                        <p className="text-sm md:text-base">Let’s start with your mind. Take a second to notice how focused and emotionally steady you feel throughout the day.</p>
                        <div>
                            <label className="block text-sm md:text-base font-medium mb-1">How focused did you feel through most of today?</label>
                            <div className="text-light_purple font-semibold text-lg mb-2">{gen_labels[focusLevel]}</div>
                            <input
                                type="range"
                                min="1" max="5" value={focusLevel} 
                                onChange={(e) => setFocusLevel(Number(e.target.value))}
                                className="w-full accent-dark_purple range-lg focus:ring-2 focus:ring-peach"
                            />
                        </div>

                        <div>
                            <label className="block text-sm md:text-base font-medium mb-1">How was your overall mood?</label>
                            <div className="text-dark_purple font-semibold text-lg mb-2">{gen_labels[moodLevel]}</div>
                            <input
                                type="range"
                                min="1" max="5" value={moodLevel} 
                                onChange={(e) => setMoodLevel(Number(e.target.value))}
                                className="w-full accent-dark_purple range-lg focus:ring-2 focus:ring-peach"
                            />
                        </div>

                        <div>
                            <label className="block text-sm md:text-base font-medium mb-1">How much did you overthink?</label>
                            <select 
                                value={overthinkingLevel} 
                                onChange={(e) => setOverthinkingLevel(e.target.value)}
                                className="border border-peach p-3 rounded-lg w-full focus:ring-2 focus:ring-peach focus:border-peach transition duration-150 ease-in-out text-peach bg-dark_purple/95"
                            >
                                <option className="hover:bg-dark_purple">Not at all</option>
                                <option>Mild</option>
                                <option>Often</option>
                                <option>Obsessively</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm md:text-base font-medium mb-1">How much tension did you carry today?</label>
                            <div className="text-dark_purple font-semibold text-lg mb-2">{gen_labels[stressLevel]}</div>
                            <input 
                                type="range" min="1" max="5" value={stressLevel} 
                                onChange={(e) => setStressLevel(Number(e.target.value))} 
                                className="w-full accent-dark_purple range-lg focus:ring-2 focus:ring-peach"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm md:text-base font-medium mb-1">How many tasks did you aim to complete?</label>
                                <input 
                                    type="number" value={tasksPlanned} 
                                    onChange={(e) => setTasksPlanned(Number(e.target.value))} 
                                    className="border border-peach p-3 rounded-lg w-full focus:ring-2 focus:ring-peach focus:border-peach transition duration-150 ease-in-out text-peach bg-dark_purple/95"
                                />
                            </div>
                            <div>
                                <label className="block text-sm md:text-base font-medium mb-1">And how many did you actually finish?</label>
                                <input 
                                    type="number" value={tasksDone} 
                                    onChange={(e) => setTasksDone(Number(e.target.value))} 
                                    className="border border-peach p-3 rounded-lg w-full focus:ring-2 focus:ring-peach focus:border-peach transition duration-150 ease-in-out text-peach bg-dark_purple/95"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm md:text-base font-medium mb-1">How much did you procrastinate today?</label>
                            <select 
                                value={procrastinationLevel} 
                                onChange={(e) => setProcrastinationLevel(e.target.value)}
                                className="border border-peach p-3 rounded-lg w-full focus:ring-2 focus:ring-peach focus:border-peach transition duration-150 ease-in-out text-peach bg-dark_purple/95"
                            > 
                                <option>Not at all</option> 
                                <option>A little</option> 
                                <option>Heavily</option> 
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm md:text-base font-medium mb-1">Your distraction level today</label>
                            <div className="text-dark_purple font-semibold text-lg mb-2">{distraction_labels[distractions]}</div> 
                            <input 
                                type="range" min="0" max="3" value={distractions} 
                                onChange={(e) => setDistraction(Number(e.target.value))} 
                                className="w-full accent-dark_purple range-lg focus:ring-2 focus:ring-peach"
                            />
                        </div>
                    </div>
                </section>

                <section className="border-b border-peach pb-8">
                    <h4 className="font-extrabold text-xl md:text-2xl mb-6 text-dark_purple animate-fadeIn">🌙 Sleep Status</h4>
                    <div className="space-y-5">
                        <p className="text-sm md:text-base">Your rest shapes your mood and focus more than anything else. Let’s see how your body rested.</p>
                        <div>
                            <label className="block text-sm md:text-base font-medium mb-1">About how many hours of sleep did you get last night?</label>
                            <input
                                type="number" step="0.5" min="0" max="24"
                                value={sleepHours}
                                onChange={(e) => setSleepHours(Number(e.target.value))}
                                className="border border-peach p-3 rounded-lg w-full focus:ring-2 focus:ring-peach focus:border-peach transition duration-150 ease-in-out text-peach bg-dark_purple/95"
                            />
                        </div>

                        <div>
                            <label className="block text-sm md:text-base font-medium mb-1">How refreshing was your sleep?</label>
                            <div className="text-dark_purple font-semibold text-lg mb-2">{sleep_labels[sleepQuality]}</div>
                            <input
                                type="range" min="1" max="5" value={sleepQuality}
                                onChange={(e) => setSleepQuality(Number(e.target.value))}
                                className="w-full accent-dark_purple range-lg focus:ring-2 focus:ring-peach"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-base font-medium mb-2">Did you manage to rest or nap during the day?</label>
                            <div className="flex gap-6">
                                <label className="inline-flex items-center">
                                    <input type="radio" name="napTaken" value="Yes" checked={napTaken === "Yes"} onChange={(e) => setNapTaken(e.target.value)} className="form-radio accent-peach h-5 w-5" /> 
                                    <span className="ml-2 text-base">Yes</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input type="radio" name="napTaken" value="No" checked={napTaken === "No"} onChange={(e) => setNapTaken(e.target.value)} className="form-radio accent-peach h-5 w-5"/> 
                                    <span className="ml-2 text-base">No</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Physical Health Section */}
                <section className="border-b border-peach pb-8">
                    <h4 className="font-extrabold text-xl md:text-2xl mb-6 text-dark_purple animate-fadeIn">💪 Physical Health</h4>
                    <div className="space-y-5">
                        <p className="text-sm md:text-base">Your body is your energy engine. Let’s notice how you fueled and moved it today.</p>
                        <div>
                            <label className="block text-sm md:text-base font-medium mb-1">How energetic did you feel today?</label>
                            <div className="text-dark_purple font-semibold text-lg mb-2">{gen_labels[energyLevel]}</div>
                            <input
                                type="range"
                                min="1" max="5" value={energyLevel} 
                                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                                className="w-full accent-dark_purple range-lg focus:ring-2 focus:ring-peach"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm md:text-base font-medium mb-1">What kind of physical exercise did you do today?</label>
                            <select 
                                value={exerciseLevel} 
                                onChange={(e) => setExerciseLevel(e.target.value)}
                                className="border border-peach p-3 rounded-lg w-full focus:ring-2 focus:ring-peach focus:border-peach transition duration-150 ease-in-out text-peach bg-dark_purple/95"
                            > 
                                <option>None</option> 
                                <option>Light (yoga, cycling)</option> 
                                <option>Heavy (gym/sports)</option> 
                            </select>
                        </div> 

                        <div>
                            <label className="block text-sm md:text-base font-medium mb-1">About how much water did you drink? (litres)</label> 
                            <input 
                                type="number" min="0.0" max="10.0" step="0.25" 
                                value={hydrationLiters} 
                                onChange={(e) => setHydrationLiters(Number(e.target.value))} 
                                className="border border-peach p-3 rounded-lg w-full focus:ring-2 focus:ring-peach focus:border-peach transition duration-150 ease-in-out text-peach bg-dark_purple/95"
                            />
                        </div> 

                        <div>
                            <label className="block text-base font-medium mb-2">Did you eat outside meals?</label>
                            <div className="flex gap-6">
                                <label className="inline-flex items-center">
                                    <input type="radio" name="outsideFood" value="Yes" checked={outsideFood === "Yes"} onChange={(e) => setOutsideFood(e.target.value)} className="form-radio accent-peach h-5 w-5" /> 
                                    <span className="ml-2 text-base">Yes</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input type="radio" name="outsideFood" value="No" checked={outsideFood === "No"} onChange={(e) => setOutsideFood(e.target.value)} className="form-radio accent-peach h-5 w-5" /> 
                                    <span className="ml-2 text-base">No</span>
                                </label>
                            </div>
                        </div> 

                        <div>
                            <label className="block text-sm md:text-base font-medium mb-1">How much junk food did you consume?</label>
                            <div className="text-dark_purple font-semibold text-lg mb-2">{junk_labels[junkFoodIntake]}</div> 
                            <input 
                                type="range" min="0" max="3" value={junkFoodIntake} 
                                onChange={(e) => setJunkFoodIntake(Number(e.target.value))} 
                                className="w-full accent-dark_purple range-lg focus:ring-2 focus:ring-peach"
                            />
                        </div> 
                    </div>
                </section>

                {/* Screen Time Section */}
                <section className="border-b border-peach pb-8">
                    <h4 className="font-extrabold text-xl md:text-2xl mb-6 text-dark_purple animate-fadeIn">📱 Screen Time</h4>
                    <div className="space-y-5">
                        <p className="text-sm md:text-base">Digital habits affect mood, focus, and even sleep. Let’s see how your screen time went.</p>
                        <div>
                            <label className="block text-sm md:text-base font-medium mb-1">Roughly how many hours were you on screens today?</label> 
                            <input 
                                type="number" step="0.25" value={screenTime} 
                                onChange={(e) => setScreenTime(Number(e.target.value))} 
                                className="border border-peach p-3 rounded-lg w-full focus:ring-2 focus:ring-peach focus:border-peach transition duration-150 ease-in-out text-peach bg-dark_purple/95"
                            />
                        </div> 
                        
                        <div>
                            <label className="block text-sm md:text-base font-medium mb-1">How many hours did you spend mindlessly scrolling or consuming content?</label> 
                            <input 
                                type="number" step="0.25" value={doomScrollingTime} 
                                onChange={(e) => setDoomScrollingTime(Number(e.target.value))} 
                                className="border border-peach p-3 rounded-lg w-full focus:ring-2 focus:ring-peach focus:border-peach transition duration-150 ease-in-out text-peach bg-dark_purple/95"
                            />
                        </div>
                    </div>
                </section>

                {/* Yesterday's Productivity Section */}
                <section>
                    <h4 className="font-extrabold text-xl md:text-2xl mb-6 text-dark_purple animate-fadeIn">🗓️ Yesterday’s Productivity</h4>
                    <p className="my-5">This score is automatically computed based on your yesterday’s inputs. It is read-only and cannot be edited.</p>
                    <input
                    type="number"
                    value={yesterdayProductivity}
                    readOnly
                    className="border border-peach p-3 rounded-lg w-full focus:ring-2 focus:ring-peach focus:border-peach transition duration-150 ease-in-out font-normal text-peach bg-dark_purple/95"
                    />
                </section>

            </div>

            {/* --- BUTTONS --- */}
            <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12">
                <button
                    type="submit"
                    className="bg-light_purple border border-peach text-[#F8F4E8] font-bold tracking-wider
                            px-8 py-3 rounded-full shadow-md hover:bg-opacity-90 transition duration-300
                            ease-in-out transform hover:scale-[1.02] w-auto mx-auto sm:mx-0">
                    Submit Daily Log
                </button>

                <button
                    type="reset"
                    onClick={() => window.location.reload()}
                    className="bg-cream text-light_purple border border-dark_purple font-semibold
                            px-8 py-3 rounded-full shadow-md hover:bg-[#e5b8a4] transition duration-300
                            ease-in-out transform hover:scale-105 w-auto mx-auto sm:mx-0">
                    Reset Form
                </button>
            </div>

        </form>

        {loading && <p className="mt-6 text-gray-300">⏳{loadingMessages[messageIndex]}</p>}
        {error && <p className="mt-6 text-red-400">{error}</p>}

        {result && (
            <div className="mt-12 w-full max-w-3xl animate-fadeIn">
                <div className="flex flex-wrap justify-center gap-6">
                    <div className="bg-[#F8F4E8] shadow-xl border border-gray-200 rounded-xl p-6 w-72 text-center transition-shadow hover:shadow-2xl">
                        <h4 className="font-semibold text-lg md:text-xl text-gray-700 mb-2">Health Score</h4>
                        <p className={`text-4xl md:text-5xl font-extrabold text-${getTColor(result["health_score"])}`}>{result["health_score"]}</p>
                        <p className="text-gray-500 mt-1 text-lg">{result["rating"]}</p>
                    </div>

                    {/* PRODUCTIVITY*/}
                    <div className="bg-[#F8F4E8] shadow-xl border border-gray-200 rounded-xl p-6 w-72 text-center transition-shadow hover:shadow-2xl">
                        <h4 className="font-semibold text-lg md:text-xl text-gray-700 mb-2">Predicted Productivity</h4>
                        <p className="text-4xl md:text-5xl font-extrabold text-light_purple">{result["predicted_productivity"]}</p>
                    </div>
                </div>

                {/* TIPS*/}
                <div className="bg-[#F8F4E8] shadow-xl border border-gray-200 rounded-xl p-8 mt-8 transition-shadow hover:shadow-2xl animate-fadeIn">
                    <h4 className="font-extrabold text-xl md:text-2xl text-light_purple mb-4">💡 Personalized Tips</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-3 pl-4">
                        {result.tips.map((tip, index) => (
                            <li key={index} className={`text-sm md:text-base ${tip.type==="positive"?"text-emerald-900":"text-rose-800"}`}>{tip.text}</li>
                        ))}
                    </ul>
                </div>

                <button onClick={handleDownloadPDF} className="bg-light_purple border border-peach text-[#F8F4E8] font-bold tracking-wider
                            px-8 py-3 rounded-full shadow-md hover:bg-opacity-90 transition duration-300
                            ease-in-out transform hover:scale-[1.02] w-auto mx-auto sm:mx-0 mt-6">
                    Download Summary PDF
                </button>
            </div>
        )}
    </div>
  );
}

export default FormPage;
