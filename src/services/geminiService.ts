
import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const generateDJCommentary = async (songTitle: string, artist: string) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Aja como o DJ da "Rádio Studio - O Som Perfeito". Seu estilo é carismático, focado em Worship/Gospel Internacional. 
      Faça um comentário curto e inspirador sobre "${songTitle}" de "${artist}".`,
    });
    return response.text;
  } catch (error) {
    return "E aí família Rádio Studio! Preparados para mais um louvor que vai tocar seu coração?";
  }
};

export const getDailyVerse = async () => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Gere um versículo bíblico de esperança para os ouvintes da Rádio Studio.`,
    });
    return response.text;
  } catch (error) {
    return "Tudo posso naquele que me fortalece (Filipenses 4:13).";
  }
};

export const processSongRequest = async (requestText: string) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analise o pedido de música gospel na Rádio Studio: "${requestText}". Confirme com estilo.`,
    });
    return response.text;
  } catch (error) {
    return "Pedido recebido na Rádio Studio!";
  }
};
