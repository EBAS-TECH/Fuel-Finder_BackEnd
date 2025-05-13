import { GoogleGenerativeAI } from '@google/generative-ai';


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const geminiSuggestStationsForNearStations = async (inputData) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
You are a helpful assistant. Based on the following list of fuel stations, rank them in order of best suggestion for the driver using these factors:

1. Distance in kilometers (closer is better)
2. Favorite status (true = user's preferred station)
3. User rating out of 5 (higher is better)
4. Availability in millisecond remaining this month (higher is better)

Here are the stations:

${JSON.stringify(inputData, null, 2)}

Please return ONLY the top 3 recommended stations id in the following format:

{
  "1": "Station id",
  "2": "Station id",
  "3": "Station id"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text;
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    throw error;
  }
};

export const geminiCategorizeAndSuggestStations = async (inputData) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
You are a helpful assistant that evaluates and categorizes fuel station performance.

You are given a list of fuel stations, each with the following attributes:
- **Availability (in milliseconds left this month)**: indicates how long fuel is expected to remain available (higher is better)
- **Favorite_users**: how many users have marked this station as their favorite (higher is better)
- **User Rating (out of 5)**: overall customer satisfaction (higher is better)

**Your task is to:**
1. Categorize each station's service quality as one of: **"Low"**, **"Average"**, or **"High"**.
2. For each station, include:
   - A **detailed reason** for the category that explains each factor **individually** (favorite_users, user rating, and availability). When mentioning availability, **convert the milliseconds into hours** and round to two decimal places.
   - A **practical suggestion** for how the station can improve its overall service quality.

Be **very descriptive** in your reasoning. Example:
- "The station has a high number of favorites (120), which shows strong customer loyalty. The user rating of 4.7 indicates high satisfaction. It also has excellent availability (722.22 hours), meaning fuel is likely accessible throughout the month. These strong performance indicators justify the 'High' category."

Finally, return the categorized list in **JSON format**, **ordered by category**: Low first, then Average, then High.

Use the input data below:

${JSON.stringify(inputData, null, 2)}

Return the response in this JSON format:

{
  "stations": [
    {
      "stationId": "string",
      "category": "Low | Average | High",
      "reason": "string (detailed explanation of all factors, with availability in hours)",
      "suggestion": "string (how to improve)"
    },
    ...
  ]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text;
  } catch (error) {
    console.error("Gemini Categorization Error:", error);
    throw error;
  }
};

