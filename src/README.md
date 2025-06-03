# src/

## Overview

- **Folder name:** src
- **Purpose:** This folder contains the source code for a tool that automates the generation of `README.md` files and Copilot configuration files for a given directory. It leverages libraries like `commander` for command-line argument parsing and integrates with LLMs (Large Language Models) to generate content based on file contents. The code is structured to be modular and extensible, supporting multiple LLM providers.

## Naming Conventions

- Files are named using PascalCase (e.g., `GenerateReadmeService.ts`).
- Functions are named using camelCase (e.g., `generateReadmeService`).
- Variables are named using camelCase.
- Interfaces are prefixed with `I` (e.g., `IGenerateReadmeOptions`).

## Design Policy

- The code follows a modular design, separating concerns into different services and repositories.
- The `index.ts` file serves as the entry point, parsing command-line arguments using `commander`.
- Services handle the core application logic, orchestrating calls to repositories.
- Repositories abstract interactions with external services, such as LLMs.

## Technologies and Libraries Used

- **commander:** For parsing command-line arguments.
- **fs (Node.js):** For file system operations.
- **path (Node.js):** For path manipulation.
- **openai:**  A library for interacting with OpenAI models.
- **@google/genai:** A library for interacting with Google Gemini models.

## File Roles

| File name                               | Role                                                                                | Logic and functions                                                                                                                                              | Names of other files used             |
| --------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `index.ts`                              | Entry point of the application.                                                     | - Parses command-line arguments using `commander`. - Calls the appropriate service based on the command.                                                      | `GenerateReadmeService.ts`, `generateCopilotInstructionsService.ts` |
| `service/generateReadmeService.ts`      | Generates a `README.md` file based on folder contents.                              | - `findFiles`: Recursively or non-recursively searches for files in a directory. - Generates prompts based on found files and sends to an LLM. - Writes the generated README content to a file. | `repository/llm.ts`                  |
| `service/generateCopilotInstructionsService.ts` | Generates a Copilot configuration file.                                             | - `findAllReadmesRecursively`: Recursively searches for `README.md` files in a directory. - Concatenates README content. - Generates prompt for LLM - Saves to file.                             | `repository/llm.ts`                  |
| `repository/llm.ts`                     | Abstract factory for creating LLM clients.                                          | - `getLLMRepository`: Returns an instance of the appropriate LLM client (OpenAI or Gemini) based on the specified model.                                       | `repository/openai.ts`, `repository/gemini.ts` |
| `repository/openai.ts`                  | Implements the `LLMRepository` interface for OpenAI models.                         | - `OpenAIClient.call`: Sends a prompt to the OpenAI API and returns the response.                                                                           | `repository/llm.ts`                  |
| `repository/gemini.ts`                  | Implements the `LLMRepository` interface for Gemini models.                         | - `GeminiClient.call`: Sends a prompt to the Gemini API and returns the response.                                                                           | `repository/llm.ts`                  |

## Code Style and Examples

- **Asynchronous Operations:** The code extensively uses `async/await` for handling asynchronous operations, particularly when interacting with the file system and LLM APIs.

  ```typescript
  async function generateReadmeService(options: GenerateReadmeOptions) {
    const files = await findFiles(options.folderPath); // Example of using async function
    // ... more async operations
  }
  ```

- **Interface-Based Programming:** The `LLMRepository` interface defines a contract for interacting with different LLMs, promoting loose coupling and testability.

  ```typescript
  interface LLMRepository {
    call(prompt: string): Promise<string>;
  }

  class OpenAIClient implements LLMRepository {
    async call(prompt: string): Promise<string> {
      // Implementation for OpenAI
    }
  }
  ```

- **Error Handling:** The code includes basic error handling with `try...catch` blocks.

  ```typescript
  try {
    const result = await this.client.chat.completions.create({ // example
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
    });
    return res.choices[0].message.content || '';
  } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error; // Re-throw for handling higher up the call stack
  }
  ```

## File Templates and Explanations

- **Service File Template:**

  ```typescript
  // service/exampleService.ts
  import { /* Dependencies */ } from '...';

  export async function exampleService(options: ExampleOptions) {
    // Implementation logic
  }

  interface ExampleOptions {
    // Options for the service
  }
  ```

- **Repository File Template:**

  ```typescript
  // repository/exampleRepository.ts
  import { LLMRepository } from './llm';

  class ExampleClient implements LLMRepository {
    async call(prompt: string): Promise<string> {
      // Implementation logic
    }
  }

  export default ExampleClient;
  ```

## Coding Rules

- **Single Responsibility Principle:** Each function and class should have a single, well-defined purpose.
- **Don't Repeat Yourself (DRY):** Avoid duplicating code by creating reusable functions and modules.
- **Keep Functions Short:**  Aim for functions that are less than 50 lines of code.  If a function is getting long, consider refactoring it into smaller, more focused functions.
- **Use Descriptive Names:**  Use clear and descriptive names for variables, functions, and classes to improve code readability.
- **Write Unit Tests:**  Write unit tests to ensure the correctness of your code.
- **Follow the Established Naming Conventions:**  Consistent naming makes the project easier to understand and maintain.

## Notes for Developers

- When adding support for new LLMs, create a new repository file implementing the `LLMRepository` interface.
- Ensure proper error handling is implemented to catch potential exceptions during API calls.
- When LLMs are contextually expensive, consider adding file size or token limits to the prompts.
- Remember to set the API key for selected LLM either as system environment variables or through command line.
