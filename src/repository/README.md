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

- **Abstraction:** The primary design principle is abstraction. The `LLMRepository` interface defines a contract for interacting with any LLM. Concrete implementations (e.g., `OpenAIClient`, `GeminiClient`) adhere to this interface, allowing for easy switching between LLMs.
- **Configuration:** LLM clients should be configurable via a configuration object passed to their constructor. This allows for customization of API keys, models, and other relevant parameters.
- **Error Handling:** Implement robust error handling to gracefully manage potential issues during API calls to LLMs.
- **Asynchronous Operations:** All interactions with LLMs should be asynchronous to prevent blocking the main thread.

## Technologies and Libraries Used

- **TypeScript:** For type safety and improved code organization.
- **openai (npm package):**  Official OpenAI client library.
- **@google/generative-ai:**  Official Google GenAI client library.

## File Roles and Responsibilities

| File Name     | Role                                            | Logic and Functions                                                                                                                         | Names of other files used |
| ------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `llm.ts`      | Abstraction and Factory for LLM Clients         | - Defines the `LLMRepository` interface.  - Provides the `getLLMRepository` factory function.                                                | `openai.ts`, `gemini.ts`  |
| `openai.ts`   | Implementation for OpenAI LLM interactions   | - Defines the `OpenAIClient` class, implementing `LLMRepository`.  - Implements the `call` method to interact with the OpenAI API.      - Provides `createOpenAIClient` function.                                  | `llm.ts`                 |
| `gemini.ts`   | Implementation for Gemini LLM interactions   | - Defines the `GeminiClient` class, implementing `LLMRepository`.  - Implements the `call` method to interact with the Gemini API.        | `llm.ts`                 |

### Logic and Functions Details

*   **`llm.ts`**
    *   **`LLMRepository` Interface:** Defines the `call` method, which accepts a prompt string and returns a Promise that resolves to a string representing the LLM's response.
    *   **`getLLMRepository` Function:**  A factory function that takes a model name, API key and optional API url as input.  Based on the `model` string, it instantiates and returns the appropriate LLM client (e.g., `OpenAIClient`, `GeminiClient`). Throws an error if the model is not supported.

*   **`openai.ts`**
    *   **`OpenAIClient` Class:**
        *   **Constructor:** Takes an `OpenAIConfig` object containing the API key, model name, and API URL.  Initializes the OpenAI client using the provided configuration. Sets a default model (`gpt-4o`) if one is not provided.
        *   **`call` Method:** Takes a prompt string as input. Uses the OpenAI client to create a chat completion with the prompt. Returns a Promise that resolves to the content of the first choice in the completion response. Returns an empty string if no content is found.
    *   **`createOpenAIClient` Function:** An async function to create an instance of the OpenAIClient. Takes `apiKey`, `model?` and `apiUrl?` as parameters.

*   **`gemini.ts`**
    *   **`GeminiClient` Class:**
        *   **Constructor:** Takes a `GeminiConfig` object containing the API key and model name. Initializes the Gemini client using the provided configuration. Sets a default model (`gemini-2.0-flash`) if one is not provided.
        *   **`call` Method:** Takes a prompt string as input. Uses the Gemini client to generate content based on the prompt. Returns a Promise that resolves to the content of the response.

## Code Style and Examples

*   **Dependency Injection:** The `getLLMRepository` function uses a form of dependency injection to provide the appropriate LLM client.

    ```typescript
    const llm = await getLLMRepository({ model: 'gpt-4o', apiKey: 'YOUR_API_KEY' });
    const response = await llm.call('Write a short poem.');
    console.log(response);
    ```

*   **Asynchronous Operations:** All API calls to LLMs are asynchronous and use `async/await`.

    ```typescript
    async call(prompt: string): Promise<string> {
      const res = await this.client.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
      });
      return res.choices[0].message.content || '';
    }
    ```

## File Templates and Explanations

*   **`llm.ts` (Interface):**
    This file MUST contain the `LLMRepository` interface and the `getLLMRepository` factory function.  The interface defines the contract for all LLM clients. The factory determines which LLM client to return based on the configuration.

*   **`openai.ts` (Implementation):**
    Implementations like this one for OpenAI, MUST implement the `LLMRepository` interface.  The `call` method should use the appropriate API to interact with the LLM and return the response. The specific API and data transformations depend on the LLM being used.

## Coding Rules Based on the Above

1.  **Adhere to Naming Conventions:** Consistently use the defined naming conventions for files, classes, variables, and methods.
2.  **Implement the `LLMRepository` Interface:** All LLM client implementations must implement the `LLMRepository` interface.
3.  **Use Asynchronous Operations:** All interactions with LLMs must be asynchronous.
4.  **Handle Errors Gracefully:** Implement robust error handling to catch and manage potential errors during API calls.
5.  **Use Configuration Objects:** LLM clients should be configurable via a configuration object passed to their constructor.
6.  **Keep it Simple:** Follow the KISS principle.

## Notes for Developers

*   When adding a new LLM integration, create a new file (e.g., `newllm.ts`) and implement the `LLMRepository` interface.
*   Update the `getLLMRepository` function in `llm.ts` to support the new LLM.
*   Ensure that the new LLM client is properly configured with an API key and other necessary parameters.
*   Thoroughly test the new LLM integration to ensure that it works as expected.
```