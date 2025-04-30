import GoogleGenerativeAI from '@google/generative-ai';

// Initialize with your API key
const genAI = new GoogleGenerativeAI('AIzaSyDSVd2Az8pqJXJh4QP1xAv2ZbEdMD07VG4');

async function suggestStations(inputData) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `
You are a helpful assistant. Based on the following list of fuel stations, rank them in order of best suggestion for the driver using these factors:

1. Distance in kilometers (closer is better)
2. User rating out of 5 (higher is better)
3. Availability in hours remaining this month (higher is better, means open longer)
4. Favorite status (true = user's preferred station)

Here are the stations:

${JSON.stringify(inputData, null, 2)}

Please return ONLY the top 3 recommended stations id in the following JSON format (no markdown or code block), without any description or explanation:

{
  "1": "Station id",
  "2": "Station id",
  "3": "Station id"
}
`;


  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    throw error;
  }
}

module.exports = { suggestStations };
