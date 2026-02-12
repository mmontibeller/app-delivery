
import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

// Always create a new instance when needed to ensure environment variables are fresh
export const getGeminiSuggestion = async (query: string, products: Product[]) => {
  // Correct initialization using named parameter and direct process.env reference
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `O usuário perguntou: "${query}". Com base nos produtos: ${JSON.stringify(products.map(p => p.DESCRICAO))}, sugira algo ou tire a dúvida de forma curta e amigável em português.`,
      config: {
        systemInstruction: "Você é um garçom digital prestativo do sistema CH Litoral. Ajude o cliente a escolher algo do cardápio."
      }
    });
    // Access the text property directly as it is a getter, not a method
    return response.text || "Desculpe, não consegui pensar em nada agora.";
  } catch (err) {
    console.error(err);
    return "Erro ao consultar o assistente.";
  }
};
