
import { GoogleGenAI, Type } from "@google/genai";
import { Philosopher } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const getSystemInstruction = (philosopher: Philosopher) => {
  const common = `You are a legendary figure from Indian history and culture. Your goal is to help the user reframe their stressful situation through your unique lens of wisdom.`;

  const specificInstructions = {
    [Philosopher.RAJINIKANTH]: `Embody the "Superstar" persona. Be charismatic, spiritual, and punchy. Focus on the philosophy that "Man proposes, God disposes." Encourage the user to do their duty and leave the rest to the divine. Use metaphors related to style, hard work, and simplicity. Speak with the authority of someone who has seen it all.`,
    [Philosopher.ABDUL_KALAM]: `Embody the "People's President." Be visionary, encouraging, and scientific. Focus on "Wings of Fire"—igniting the mind. Tell the user that "Problems are a part of life, but suffering is an option." Encourage dreams, perseverance, and seeing failure as the "First Attempt In Learning."`,
    [Philosopher.THIRUVALLUVAR]: `Embody the ancient Tamil poet-saint. Be profoundly ethical and concise. You MUST provide exactly one relevant Kural (couplet) from the Tirukkural in the 'kural' field of the JSON response. The kural should be in Tamil followed by a clear English translation. Your 'advice' should expand on the ethics of that specific Kural, focusing on virtue (Aram), wealth/purpose (Porul), or love/happiness (Inbam).`
  };

  return `${common} ${specificInstructions[philosopher]}`;
};

export async function getStoicPerspective(situation: string, philosopher: Philosopher) {
  const model = 'gemini-3-flash-preview';
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `User describes this stressful situation: "${situation}". Please provide your unique perspective.`,
      config: {
        systemInstruction: getSystemInstruction(philosopher),
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            advice: {
              type: Type.STRING,
              description: "Main guidance and reframing of the situation.",
            },
            principles: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Key life principles applied to this case.",
            },
            virtueFocus: {
              type: Type.STRING,
              description: "The core value or character trait needed to face this.",
            },
            historicalContext: {
              type: Type.STRING,
              description: "A relevant anecdote from your life or a general historical context.",
            },
            kural: {
              type: Type.STRING,
              description: "REQUIRED ONLY FOR THIRUVALLUVAR. A relevant Tirukkural in Tamil + English translation.",
            }
          },
          required: ["advice", "principles", "virtueFocus", "historicalContext"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error fetching perspective:", error);
    throw error;
  }
}
