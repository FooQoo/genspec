import { GoogleGenAI } from '@google/genai';
import { LLMRepository } from './llm';

export interface GeminiConfig {
  apiKey: string; // Required, API key for Google GenAI
  model?: string; // Optional, defaults to 'gemini-2.0-flash'
}

class GeminiClient implements LLMRepository {
  private client: GoogleGenAI;
  private model: string;

  constructor(config: GeminiConfig) {
    this.client = new GoogleGenAI({ apiKey: config.apiKey });
    this.model = config.model || 'gemini-2.0-flash';
  }

  /**
   * Simple chat API call to Gemini
   */
  async call(prompt: string): Promise<string> {
    try {
      const result = await this.client.models.generateContent({
        model: this.model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });
      if (result.text) return result.text;
      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        Array.isArray(result.candidates[0].content.parts) &&
        result.candidates[0].content.parts.length > 0 &&
        typeof result.candidates[0].content.parts[0].text === 'string'
      ) {
        return result.candidates[0].content.parts[0].text || '';
      }
      return '';
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }
}

export const createGeminiClient = async (
  apiKey: string,
  model?: string,
): Promise<GeminiClient> => {
  return new GeminiClient({
    apiKey,
    model
  });
};

export default GeminiClient;