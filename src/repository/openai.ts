import { OpenAI } from 'openai';
import { LLMRepository } from './llm';

export interface OpenAIConfig {
  apiKey: string;
  model?: string;
  apiUrl?: string;
  language?: string;
}

class OpenAIClient implements LLMRepository {
  private client: OpenAI;
  private model: string;
  private language: string;

  constructor(config: OpenAIConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.apiUrl || 'https://api.openai.com/v1',
    });
    this.model = config.model || 'gpt-4o';
    this.language = config.language || 'en';
  }

  async call(prompt: string): Promise<string> {
    const res = await this.client.chat.completions.create({
      model: this.model,
      messages: [{ role: 'user', content: `Generate the following in ${this.language} language: ${prompt}` }],
    });
    return res.choices[0].message.content || '';
  }
}

export const createOpenAIClient = async (
  apiKey: string,
  model?: string,
  apiUrl?: string,
  language?: string,
): Promise<OpenAIClient> => {
  return new OpenAIClient({
    apiKey,
    model,
    apiUrl,
    language,
  });
};

export default OpenAIClient;
