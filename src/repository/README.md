# src/repository

## Overview

The `repository` folder contains the logic for interacting with different Large Language Models (LLMs) such as OpenAI's GPT models and Google's Gemini models. It provides an abstraction layer that allows the application to use different LLMs without needing to change the core logic. The folder handles client creation, API calls, and error handling for each LLM.

- **Folder Name:** repository
- **Purpose:** To provide a unified interface for interacting with different LLMs, abstracting away the specific details of each API.

## Naming Conventions

-   File names should be descriptive and related to the functionality they provide (e.g., `gemini.ts`, `openai.ts`, `llm.ts`).
-   Class names should use PascalCase (e.g., `GeminiClient`, `OpenAIClient`).
-   Interface names should use PascalCase (e.g., `LLMRepository`, `GeminiConfig`, `OpenAIConfig`).
-   Variable and function names should use camelCase (e.g., `apiKey`, `createGeminiClient`).

## Design Policy

-   **Abstraction:** The primary design goal is to abstract the LLM interaction behind a common interface (`LLMRepository`).
-   **Flexibility:** The code should be flexible enough to support different LLMs and configurations.
-   **Error Handling:** Robust error handling is required to gracefully handle API failures and other potential issues.
-   **Configuration:** LLM configurations should be easily configurable through a configuration object.

## Technologies and Libraries Used

-   TypeScript: Programming language.
-   `openai`: OpenAI's official Node.js library for interacting with their API.
-   `@google/genai`: Google's GenAI Node.js library for interacting with Gemini API.

## File Roles

| File Name   | Role                                          | Logic and Functions                                                                                                                                                                                                                                                                                               | Names of other files used |
| ----------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `gemini.ts` | Implements the Gemini LLM client.             | - `GeminiClient` class implements the `LLMRepository` interface.                                                                                                                                                                                                                                                     | `llm.ts`                  |
|             |                                               | - Constructor initializes the Gemini client with API key and model.                                                                                                                                                                                                                                                      |                           |
|             |                                               | - `call(prompt: string)`:  Takes a prompt and returns the Gemini API response. The logic generates the prompt in the specified language, calls the Gemini API and retrieves the response, handling various response structures and error scenarios. It constructs the prompt including the specified language. |                           |
| `llm.ts`    | Defines the `LLMRepository` interface and factory function. | - `LLMRepository` interface defines the contract for LLM clients (the `call` method).                                                                                                                                                                                                                                       | `openai.ts`, `gemini.ts`   |
|             |                                               | - `getLLMRepository({model, apiKey, apiUrl, language})`: Factory function that returns an instance of the appropriate LLM client (OpenAI or Gemini) based on the `model` parameter. It handles the client creation.                                                                                                     |                           |
| `openai.ts` | Implements the OpenAI LLM client.             | - `OpenAIClient` class implements the `LLMRepository` interface.                                                                                                                                                                                                                                                      | `llm.ts`                  |
|             |                                               | - Constructor initializes the OpenAI client with API key, model, and API URL.                                                                                                                                                                                                                                           |                           |
|             |                                               | - `call(prompt: string)`: Takes a prompt and returns the OpenAI API response. The logic generates the prompt in the specified language, calls the OpenAI chat completion endpoint, retrieves the response, and handles potential errors. It constructs the prompt including the specified language.                 |                           |

## Code Style and Examples

### `LLMRepository` Interface

```typescript
export interface LLMRepository {
  call(prompt: string): Promise<string>;
}
```

This interface defines the contract for all LLM clients. All LLM clients must implement the `call` method, which takes a prompt and returns a promise that resolves to the LLM's response.

### Client Implementation (Example: `GeminiClient`)

```typescript
class GeminiClient implements LLMRepository {
  private client: GoogleGenAI;
  private model: string;
  private language: string;

  constructor(config: GeminiConfig) {
    this.client = new GoogleGenAI({ apiKey: config.apiKey });
    this.model = config.model || 'gemini-2.0-flash';
    this.language = config.language || 'en';
  }

  async call(prompt: string): Promise<string> {
    try {
      const result = await this.client.models.generateContent({
        model: this.model,
        contents: [{ role: 'user', parts: [{ text: `Generate the following in ${this.language} language: ${prompt}` }] }],
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
```

This code shows how to implement the `LLMRepository` interface for the Gemini LLM. The constructor initializes the Gemini client with the API key. The `call` method makes the API call to Gemini and returns the response. Note the inclusion of language in the prompt.

### Factory Function (Example: `getLLMRepository`)

```typescript
export async function getLLMRepository({
  model,
  apiKey,
  apiUrl,
  language = 'en',
}: {
  model: string;
  apiKey: string;
  apiUrl?: string;
  language?: string;
}) {
  if (model.startsWith('gpt-')) {
    return await createOpenAIClient(apiKey, model, apiUrl, language);
  } else if (model.startsWith('gemini-')) {
    return await createGeminiClient(apiKey, model, language);
  } else {
    throw new Error(`Unsupported model: ${model}`);
  }
}
```

This code shows how to use a factory function to create different LLM clients based on the `model` parameter.

## File Templates and Explanations

### LLM Client Template

```typescript
import { LLMRepository } from './llm';

export interface MyLLMConfig {
  apiKey: string;
  // Other configuration options
}

class MyLLMClient implements LLMRepository {
  private client: any; // Replace 'any' with the actual client type
  private model: string;

  constructor(config: MyLLMConfig) {
    // Initialize the client
  }

  async call(prompt: string): Promise<string> {
    // Make the API call and return the response
    return 'response'; // Replace with actual response
  }
}

export const createMyLLMClient = async (
  apiKey: string,
  model?: string,
): Promise<MyLLMClient> => {
  return new MyLLMClient({
    apiKey,
  });
};

export default MyLLMClient;
```

This template provides a starting point for implementing a new LLM client.  Replace the comments with the actual implementation details.

## Coding Rules

-   All LLM clients must implement the `LLMRepository` interface.
-   Use dependency injection for configuration parameters.
-   Implement robust error handling.
-   Write unit tests for all code.
-   Include comments to explain complex logic.

## Notes for Developers

-   When adding a new LLM, ensure that it is properly integrated into the `getLLMRepository` factory function.
-   Pay attention to API rate limits and implement appropriate retry logic if necessary.
-   Handle different response formats from different LLMs gracefully.
-   The prompt sent to the LLM should always include the target language to ensure proper output.
