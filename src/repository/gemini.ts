import { GoogleGenAI, Type } from '@google/genai';
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
   * Make the API call to Gemini
   */
  async call(prompt: string): Promise<string> {
    try {
      const systemPrompt =
        'You are a senior software developer conducting a thorough code review. You provide detailed, actionable feedback in JSON format as requested.';
      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          filename: { type: Type.STRING },
          explanation: { type: Type.STRING },
          checklistItems: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                description: { type: Type.STRING },
                status: { type: Type.STRING, enum: ['OK', 'WARNING', 'ERROR', 'PENDING'] },
              },
              propertyOrdering: ['id', 'description', 'status'],
              required: ['id', 'description', 'status'],
            },
          },
        },
        required: ['filename', 'explanation', 'checklistItems'],
        propertyOrdering: ['filename', 'explanation', 'checklistItems'],
      };

      const result = await this.client.models.generateContent({
        model: this.model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: 'application/json',
          responseSchema,
          systemInstruction: { role: 'system', parts: [{ text: systemPrompt }] },
        },
      });

      console.info('Gemini response:', result.text);

      return result.text || '';
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }
};

// Create and export Gemini client instance
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