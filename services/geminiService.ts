
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const API_KEY = process.env.API_KEY || '';

export const analyzeDocument = async (text: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // Truncate text if it's too large for standard analysis (around 30k chars for safety)
  const truncatedText = text.slice(0, 30000);

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following document text and provide a structured JSON response. 
    
    Document Text: 
    ${truncatedText}
    
    Instructions:
    1. Summarize the content in exactly 3 meaningful sentences.
    2. List up to 5 main topics/themes.
    3. Identify key entities (people, organizations, dates, locations).
    4. Determine the overall tone (e.g., Professional, Urgent, Informative).
    5. Extract potential action items or next steps.
    6. Assign a sentiment score from 0 (very negative) to 100 (very positive).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          topics: { type: Type.ARRAY, items: { type: Type.STRING } },
          entities: {
            type: Type.OBJECT,
            properties: {
              people: { type: Type.ARRAY, items: { type: Type.STRING } },
              organizations: { type: Type.ARRAY, items: { type: Type.STRING } },
              dates: { type: Type.ARRAY, items: { type: Type.STRING } },
              locations: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["people", "organizations", "dates", "locations"]
          },
          tone: { type: Type.STRING },
          action_items: { type: Type.ARRAY, items: { type: Type.STRING } },
          sentiment_score: { type: Type.NUMBER }
        },
        required: ["summary", "topics", "entities", "tone", "action_items", "sentiment_score"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as AnalysisResult;
};

export const chatWithDocument = async (
  docText: string, 
  userMessage: string, 
  history: { role: string, parts: { text: string }[] }[]
) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const model = ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      { role: 'user', parts: [{ text: `You are an expert document assistant. Base your answers ONLY on the following document context: \n\n ${docText.slice(0, 40000)}` }] },
      { role: 'model', parts: [{ text: 'I have analyzed the document. How can I help you today?' }] },
      ...history.map(h => ({ role: h.role, parts: h.parts })),
      { role: 'user', parts: [{ text: userMessage }] }
    ]
  });

  const result = await model;
  return result.text;
};
