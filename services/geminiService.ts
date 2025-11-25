import { GoogleGenAI, Type } from "@google/genai";
import { ServiceCategory } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const findBestCategory = async (userDescription: string): Promise<ServiceCategory | null> => {
  if (!userDescription) return null;

  try {
    const categories = Object.values(ServiceCategory).filter(c => c !== ServiceCategory.ALL);
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analise o pedido do utilizador: "${userDescription}". Qual destas categorias de serviço é a mais adequada? Lista: ${categories.join(', ')}. Responda apenas com o nome exato da categoria. Se não encontrar correspondência, responda "Outros".`,
      config: {
        temperature: 0.1,
        maxOutputTokens: 20
      }
    });

    const text = response.text?.trim();
    
    // Find matching enum value
    const match = categories.find(c => c.toLowerCase() === text?.toLowerCase());
    return match || null;

  } catch (error) {
    console.error("Erro ao consultar Gemini:", error);
    return null;
  }
};

export const generateSmartResponse = async (providerName: string, service: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Gera uma mensagem curta e profissional de WhatsApp (máximo 2 frases) para um cliente que quer contratar o ${providerName} para o serviço de ${service}. Em Português de Angola.`,
    });
    return response.text?.trim() || `Olá ${providerName}, gostaria de um orçamento.`;
  } catch (e) {
    return `Olá ${providerName}, gostaria de um orçamento.`;
  }
}
