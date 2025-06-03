import { createOpenAIClient } from './openai';
import { createGeminiClient } from './gemini';

export interface LLMRepository {
  // The main interface for LLM clients. Implementations must provide a call method that takes a prompt and returns a string response.
  call(prompt: string): Promise<string>;
}

// Returns the appropriate LLM client instance based on the model name.
export async function getLLMRepository({
  model,
  apiKey,
  apiUrl,
}: {
  model: string;
  apiKey: string;
  apiUrl?: string;
}) {
  if (model.startsWith('gpt-')) {
    return await createOpenAIClient(apiKey, model, apiUrl);
  } else if (model.startsWith('gemini-')) {
    return await createGeminiClient(apiKey, model);
  } else {
    throw new Error(`Unsupported model: ${model}`);
  }
}
