import { GoogleGenAI, Type, Modality, LiveServerMessage } from "@google/genai";
import { QuoteResponse } from "../types";

// Initialize Gemini Client
// WARNING: process.env.API_KEY is expected to be available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- 1. Chat Bot (Gemini 3 Pro) ---
export const createChatSession = () => {
  return ai.chats.create({
    model: 'gemini-2.5-pro',
    config: {
      systemInstruction: 'You are D.O.C Wash & Clean\'s helpful virtual assistant. You help customers with scheduling, service details (Industrial, Residential, Specialized), and general inquiries. Be polite, professional, and concise.',
    },
  });
};

// --- 2. Smart Quote (Gemini Intelligence) ---
export const generateSmartQuote = async (
  details: string
): Promise<QuoteResponse> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Analyze this cleaning request and provide a cost estimate in Nigerian Naira (NGN): "${details}". Assume standard market rates for high-quality cleaning in Nigeria. IMPORTANT: Mention that the price is negotiable and they should contact us on WhatsApp at 08158544009 for the best deal.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          estimatedCost: { type: Type.NUMBER, description: "Estimated cost in NGN" },
          estimatedTime: { type: Type.STRING, description: "Duration e.g., '3-4 hours'" },
          recommendedServices: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of specific services needed"
          },
          reasoning: { type: Type.STRING, description: "Brief explanation of the quote" }
        },
        required: ["estimatedCost", "estimatedTime", "recommendedServices", "reasoning"],
      },
    },
  });

  const text = response.text || '{}';
  const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(cleanText) as QuoteResponse;
};

// --- 3. Search Grounding (Cleaning Tips) ---
export const searchCleaningTips = async (query: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: query,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  return {
    text: response.text,
    chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

// --- 4. Maps Grounding (Location Finder) ---
export const findNearbyLocations = async (userLat?: number, userLng?: number) => {
    // Note: In a real app we'd search for actual branches. Here we simulate finding "our" branches or partners.
    // We will ask for cleaning supplies stores nearby as a proxy for "locations relevant to cleaning"
    // to demonstrate the map tool functionality since D.O.C Wash & Clean is fictional.
    const prompt = "Find top rated commercial cleaning supply stores or services near me.";

    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (userLat && userLng) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: userLat,
            longitude: userLng
          }
        }
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: config,
    });

    return {
      text: response.text,
      chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
};

// --- 5. Text-to-Speech (Welcome Message) ---
export const generateSpeech = async (text: string): Promise<string | undefined> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Fenrir' },
        },
      },
    },
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

// --- 6. Live API (Conversational Voice) ---
export const connectLiveSession = (
  onOpen: () => void,
  onMessage: (msg: LiveServerMessage) => void,
  onClose: () => void,
  onError: (err: Error) => void
) => {
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks: {
      onopen: onOpen,
      onmessage: onMessage,
      onclose: (e) => onClose(),
      onerror: (e) => onError(new Error("Live API Error")),
    },
    config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction: "You are D.O.C Wash & Clean's expert cleaning consultant. Always speak in English. Speak briefly, enthusiastically, and professionally about cleaning services (Industrial, Home, Office).",
        speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
        }
    }
  });
};
