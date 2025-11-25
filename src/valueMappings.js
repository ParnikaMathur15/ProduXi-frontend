export const universalLabelMap = {
  1: "Very Low",
  2: "Low",
  3: "Moderate",
  4: "High",
  5: "Very High"
};

export const overthinkingMap = {
  0: "Not at all",
  1: "Mild",
  2: "Often",
  3: "Obsessively"
};

export const procrastinationMap = {
  0: "Not at all",
  1: "A little",
  2: "Heavily"
};

export const radioMap = {
  0: "No",
  1: "Yes"
};

export const exerciseMap = {
  0: "None",
  1: "Light (yoga, cycling)",
  2: "Heavy (gym/sports)"
};

export const distractionMap = {
  0: "None",
  1: "Few distractions",
  2: "Frequent distractions",
  3: "Constant distractions"
};

export const junkFoodMap = {
  0: "None",
  1: "A bit",
  2: "A lot",
  3: "Way too much"
};

export const sleepQualityMap = {
  1: "Very Poor",
  2: "Poor",
  3: "Average",
  4: "Good",
  5: "Very Refreshing"
};


export function convertFormValues(formInputs) {
  const universalFields = [
    "focus_level",
    "mood_level",
    "stress_level",
    "body_energy"
  ];

  const readable = {};

  for (const key in formInputs) {
    const value = formInputs[key];

    if (universalFields.includes(key)) {
      readable[key] = universalLabelMap[value];
      continue;
    }

    switch (key) {
      case "overthinking_level":
        readable[key] = overthinkingMap[value];
        break;

      case "procrastination_level":
        readable[key] = procrastinationMap[value];
        break;

      case "exercise_level":
        readable[key] = exerciseMap[value];
        break;

      case "nap_taken":
      case "outside_food":
        readable[key] = radioMap[value];
        break;

      case "distractions":
        readable[key] = distractionMap[value];
        break;

      case "junk_food_intake":
        readable[key] = junkFoodMap[value];
        break;

      case "sleep_quality":
        readable[key] = sleepQualityMap[value];
        break;

      default:
        readable[key] = value;
    }
  }

  return readable;
}
