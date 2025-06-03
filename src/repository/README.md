# README.md

## Overview of `repository` Folder

- **Folder Name:** `repository`
- **Purpose:** This folder houses the code responsible for interacting with Large Language Models (LLMs). It provides an abstraction layer that allows the application to use different LLMs (e.g., OpenAI, Gemini) without modifying the core logic. This promotes flexibility and adaptability to evolving LLM technologies.

## Naming Conventions

- **Files:** Use descriptive names that clearly indicate the LLM provider or the purpose of the file (e.g., `openai.ts`, `llm.ts`, `gemini.ts`).
- **Classes/Interfaces:** Use PascalCase (e.g., `OpenAIClient`, `LLMRepository`).
- **Variables/Constants:** Use camelCase (e.g., `apiKey`, `model`).
- **Methods:** Use camelCase (e.g., `call`, `getLLMRepository`).

## Design Policy

- **Abstraction:** The primary design principle is abstraction. The `LLMRepository` interface defines a contract for interacting with any LLM. Concrete implementations (e.g., `OpenAIClient`, `GeminiClient`) conform to this interface, allowing for easy switching between LLMs.
- **Factory Pattern:** The `getLLMRepository` function acts as a factory, creating and returning the appropriate LLM client instance based on the provided configuration.
- **Configuration:** Each LLM client is configured using a dedicated configuration object (e.g., `OpenAIConfig`, `GeminiConfig`). This ensures that each client has the necessary parameters to function correctly.

## Technologies and Libraries Used

- **TypeScript:** All files are written in TypeScript for type safety and improved code maintainability.
- **OpenAI Node.js Library:** Used for interacting with OpenAI's API.
- **GoogleGenAI Node.js Library:** Used for interacting with Google's Gemini API.

## File Roles

| File Name     | Role                                  | Logic and Functions                                                                                                                                                                           | Names of other files used |
| ------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `llm.ts`      | LLM Repository Interface and Factory | - Defines the `LLMRepository` interface with a `call` method.<br>- Implements the `getLLMRepository` factory function to return the appropriate LLM client based on the provided model name. | `openai.ts`, `gemini.ts` |
| `openai.ts`   | OpenAI Client Implementation          | - Defines the `OpenAIConfig` interface for configuration.<br>- Implements the `OpenAIClient` class, which implements the `LLMRepository` interface.<br>- Implements `call` to interact with OpenAI API. <br>- implements `createOpenAIClient` factory function. | `llm.ts`               |
| `gemini.ts`   | Gemini Client Implementation          | - Defines the `GeminiConfig` interface for configuration.<br>- Implements the `GeminiClient` class, which implements the `LLMRepository` interface.<br>- Implements `call` to interact with Gemini API. | `llm.ts`               |

## Code Style and Examples

- **Interface Implementation:**

  ```typescript
  class OpenAIClient implements LLMRepository {
    async call(prompt: string): Promise<string> {
      // Implementation for calling the OpenAI API
    }
  }
  ```

- **Factory Pattern:**

  ```typescript
  export async function getLLMRepository({ model, apiKey }: { model: string; apiKey: string }) {
    if (model.startsWith('gpt-')) {
      return await createOpenAIClient(apiKey, model);
    } // ... other model types
  }
  ```

- **Configuration Objects:**

  ```typescript
  interface OpenAIConfig {
    apiKey: string;
    model?: string;
  }

  class OpenAIClient implements LLMRepository {
    constructor(config: OpenAIConfig) {
      // ...
    }
  }
  ```

## File Templates and Explanations

- **LLM Implementation Template:**

  ```typescript
  import { LLMRepository } from './llm';

  export interface YourLLMConfig {
    apiKey: string;
    // ... other configuration options
  }

  class YourLLMClient implements LLMRepository {
    constructor(config: YourLLMConfig) {
      // Initialize client
    }

    async call(prompt: string): Promise<string> {
      // Implement LLM call logic
    }
  }

  export default YourLLMClient;
  ```

  Explanation:
    - Import the `LLMRepository` interface.
    - Define a configuration interface for your LLM.
    - Create a class that implements `LLMRepository`.
    - Implement the `call` method to interact with your LLM's API.

## Coding Rules Based on the Above

- All LLM implementations must implement the `LLMRepository` interface.
- Each LLM implementation should have a corresponding configuration interface.
- Use the `getLLMRepository` factory function to create LLM client instances.
- Handle errors appropriately and provide informative error messages.
- Ensure that all API keys and sensitive information are handled securely.

## Notes for Developers

- When adding a new LLM integration, create a new file in this directory.
- Remember to update the `getLLMRepository` function in `llm.ts` to include the new LLM.
- Thoroughly test your implementation to ensure that it functions correctly and handles edge cases.
- Document your code clearly and concisely.
```