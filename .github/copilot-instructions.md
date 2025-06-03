We are developers for the following projects:

---

# genspec
A simple CLI tool for generating code specifications.
This tool reads the files in a folder and generates a README based on their contents.
It also supports `copilot-instructions.md`, generating a Copilot configuration file based on the contents of each folder.

# Installation
```bash
npm install -g genspec
```

# Usage
```bash
genspec <command> [options]
```

# Commands
- `readme`: Generate a README file.
- `copilot`: Generate a Copilot configuration file.

# Options
- `--directory <path>`: Specify the directory to generate the file in (default: current directory).
- `--recursive`: Recursively generate files in subdirectories. 
- `--model <model>`: Specify the model to use for LLM generation. choose from `gpt-xxx` or `gemini-xxx`.
- `--api-key <key>`: Specify the API key for the LLM service.
- `--api-url <url>`: Specify the API URL for the LLM service. (default: Each LLM service has its own default URL)

---

# Project rule 
- All files in the project should be written in English.

# Attention for Users
- You can play a sound to alert the user when input or confirmation is needed.
- You can run the following command in the console to play a sound for user attention.

```bash
osascript -e 'beep'
```
---

## General Coding Guidelines and Conventions

These guidelines apply to the entire project.

*   **Language:** All files must be written in English.
*   **Error Handling:** Implement robust error handling, especially when interacting with external APIs. Handle errors appropriately and provide informative error messages.
*   **Asynchronous Operations:** Use `async/await` for asynchronous tasks to prevent blocking the main thread and to improve code readability. Return types of asynchronous functions should be `Promise<T>`, where `T` is the resolved type.
*   **Comments:** Write clear and concise comments to explain complex logic. Document all new services and modifications to existing services thoroughly.
*   **Testing:** Ensure all services are testable through unit tests. Thoroughly test your implementation to ensure that it functions correctly and handles edge cases.
*   **Security:** Ensure that all API keys and sensitive information are handled securely. Pay special attention to security considerations when handling sensitive data.
*   **Code Clarity:** Prioritize code clarity and maintainability over premature optimization.
*   **Parameters:** Parameters passed to functions should be explicitly typed.
*   **Naming Conventions:**
    *   Files are named using PascalCase (e.g., `GenerateReadmeService.ts`, `OpenAIClient.ts`).
    *   Functions and variables are named using camelCase (e.g., `generateReadmeService`, `apiKey`).
    *   Interfaces are prefixed with `I` (e.g., `IGenerateReadmeOptions`, `LLMRepository`).
*   **Modularity:** The code follows a modular design, separating concerns into different services and modules.
*   **Absolute Imports:** Use absolute imports for modules within the project.

---

## `src/` Folder Instructions

*   **Purpose:** Contains the source code for the command-line tool.
*   **Design Policy:** The code follows a modular design, separating concerns into different services. The `index.ts` file serves as the entry point, parsing command-line arguments. The `GenerateReadmeService.ts` handles the core logic of interacting with the LLM and generating the README content.
*   **Technologies and Libraries Used:** Commander, TypeScript, LLM API (abstracted).
*   **Coding Rules Based on the Above:**
    1.  **Follow Naming Conventions:** Adhere to PascalCase for files, camelCase for functions and variables, and `I` prefix for interfaces.
    2.  **Modular Design:** Separate concerns into different services and modules.
    3.  **Asynchronous Operations:** Use `async/await` for asynchronous tasks.
    4.  **Command-Line Arguments:** Use `commander` for parsing command-line arguments.

*   **Notes for Developers:**
    *   Before running, ensure you have the necessary LLM API key and URL configured (if applicable).
    *   The quality of the generated README depends heavily on the LLM used and the structure of the target directory.
    *   Consider adding more detailed error handling and logging for production use.
    *   Explore options for customizing the README generation process, such as providing a custom prompt or template.
    *   Remember to install the necessary dependencies (e.g., `commander`) using `npm install` or `yarn install`.

---

## `repository/` Folder Instructions

*   **Purpose:** Houses the code responsible for interacting with Large Language Models (LLMs).
*   **Design Policy:** Abstraction is the primary design principle. The `LLMRepository` interface defines a contract for interacting with any LLM. Concrete implementations (e.g., `OpenAIClient`, `GeminiClient`) conform to this interface, allowing for easy switching between LLMs. The `getLLMRepository` function acts as a factory, creating and returning the appropriate LLM client instance based on the provided configuration.
*   **Technologies and Libraries Used:** TypeScript, OpenAI Node.js Library, GoogleGenAI Node.js Library.
*   **Coding Rules:**
    *   All LLM implementations must implement the `LLMRepository` interface.
    *   Each LLM implementation should have a corresponding configuration interface.
    *   Use the `getLLMRepository` factory function to create LLM client instances.
    *   Handle errors appropriately and provide informative error messages.
    *   Ensure that all API keys and sensitive information are handled securely.

*   **Notes for Developers:**
    *   When adding a new LLM integration, create a new file in this directory.
    *   Remember to update the `getLLMRepository` function in `llm.ts` to include the new LLM.
    *   Thoroughly test your implementation to ensure that it functions correctly and handles edge cases.
    *   Document your code clearly and concisely.

---

## `service/` Folder Instructions

*   **Purpose:** Encapsulates the application's business logic.
*   **Design Policy:** Services should be thin and focused on orchestration, delegating complex operations to other modules like repositories or utility functions. Services should not directly access request or response objects from the HTTP layer. Services should handle error cases gracefully and return meaningful error messages or throw exceptions. Services should be designed to be easily testable, ideally with unit tests.
*   **Technologies and Libraries Used:** TypeScript, fs (Node.js file system module), path (Node.js path module).
*   **Coding Rules:**
    *   Adhere to the Naming Conventions specified above. Service files should end with the suffix `Service` (e.g., `generateReadmeService.ts`).
    *   Implement comprehensive error handling using try-catch blocks.
    *   Utilize `async/await` for asynchronous operations to improve code readability.
    *   Write clear and concise comments to explain complex logic.
    *   Keep service functions focused on orchestration and delegate complex operations.
    *   Ensure all services are testable through unit tests.
    *   All functions should have descriptive names that clearly indicate their purpose.
    *   Avoid deeply nested code blocks to improve readability.
    *   Prioritize code clarity and maintainability over premature optimization.
    *   Parameters passed to functions should be explicitly typed.

*   **Notes for Developers:**
    *   When creating new services, consider the existing architecture and try to maintain a consistent style.
    *   Before making changes to existing services, ensure you understand their purpose and how they are used by other parts of the application.
    *   Document all new services and modifications to existing services thoroughly.
    *   Pay special attention to security considerations when handling sensitive data.
    *   When in doubt, consult with other developers or refer to the project's coding standards.
