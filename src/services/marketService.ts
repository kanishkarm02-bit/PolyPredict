import { GoogleGenAI, Type } from "@google/genai";

export async function generateMarket(query: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-preview",
    contents: `Generate a prediction market based on the user's search query: "${query}".
    Include a catchy title, a category (Crypto, Macro, Politics, Tech, or Other), realistic 'yes' and 'no' probabilities (summing to 1), a realistic trading volume (e.g., '$2.5M'), an expiry date (e.g., 'Dec 31, 2026'), and an article URL for context.
    Also generate 4 recent news headlines related to this topic with sentiment (Bullish, Bearish, or Neutral) and a relative time (e.g., '2h ago').`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "A short uppercase ID like POLY-SPACEX-2030" },
          title: { type: Type.STRING },
          category: { type: Type.STRING },
          yes: { type: Type.NUMBER },
          no: { type: Type.NUMBER },
          volume: { type: Type.STRING },
          end: { type: Type.STRING },
          articleUrl: { type: Type.STRING },
          news: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                sentiment: { type: Type.STRING },
                time: { type: Type.STRING }
              }
            }
          }
        },
        required: ["id", "title", "category", "yes", "no", "volume", "end", "articleUrl", "news"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text);
}
