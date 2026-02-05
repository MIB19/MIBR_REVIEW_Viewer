import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

// Initialize the API client
// const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const createChatSession = () => {
  // return ai.chats.create({
  //   model: "gemini-3-flash-preview",
  //   config: {
  //     systemInstruction: SYSTEM_INSTRUCTION,
  //     temperature: 0.7,
  //   },
  // });
};

export const sendMessageToGemini = async (
  chat: Chat,
  message: string,
): Promise<string> => {
  try {
    const response = await chat.sendMessage({ message });
    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error while processing your request. Please check your API key.";
  }
};
