import { GoogleGenAI } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

/**
 * Shared server-side singleton client for Google Gemini API.
 * Uses the latest @google/genai SDK with gemini-3.7-flash for UMKM consultations and RFQ analysis.
 */
export function getGeminiAI(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY || '';
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}
