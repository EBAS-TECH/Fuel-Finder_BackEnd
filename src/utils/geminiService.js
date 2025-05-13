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
