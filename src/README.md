# src/

## Overview

- **Folder name:** src
- **Purpose:** This folder contains the TypeScript source code for a command-line tool designed to automate the creation of `README.md` files and Copilot configuration instructions. It leverages the `commander` library for parsing command-line arguments. The tool aims to integrate with Large Language Models (LLMs), such as OpenAI's GPT models and Google's Gemini models, to dynamically generate content based on the contents of a specified directory. The architecture is modular, intended for easy extension with different LLM providers and functionalities.

## Naming Conventions

- Files are named using PascalCase with the `.ts` extension (e.g., `GenerateReadmeService.ts`).
- Functions are named using camelCase (e.g., `generateReadmeService`).
- Variables are named using camelCase.
- Interfaces are prefixed with `I` (e.g., `IGenerateReadmeOptions`).

## Design Policy

- The codebase emphasizes a modular design, separating concerns into distinct services.
- `index.ts` acts as the program's entry point, handling command-line argument parsing and coordinating the execution flow.
- Services encapsulate the core logic for generating README files and Copilot instructions. This design promotes reusability and maintainability.

## Technologies and Libraries Used

- TypeScript: The primary programming language, providing strong typing and modern language features.
- Commander: A Node.js library for building command-line interfaces, used for parsing command-line arguments and options.
- Node.js: The runtime environment for executing the TypeScript code.
- File system APIs (`fs` module): Used for reading file contents.

## File Roles

| File Name                             | Role                                                 | Logic and Functions                                                                                                                                                                                                                                                                                                                                                        | Names of other files used                                                |
| ------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `index.ts`                            | Entry point and command handler                      | - Initializes the Commander program.  - Defines command-line options and arguments for the `readme` and `copilot` commands.  - Parses the command-line arguments provided by the user.  - Dispatches the execution to the appropriate service (`GenerateReadmeService` or `generateCopilotInstructionsService`) based on the command specified.  - Passes user-provided options (directory, model, API key, API URL, recursive flag) to the service. | `GenerateReadmeService.ts`, `service/generateCopilotInstructionsService.ts` |
| `service/GenerateReadmeService.ts`    | Generates the `README.md` file                      | - Accepts a configuration object containing folder path, LLM model, API key, API URL, and recursive flag.  - Reads the contents of files from the specified directory (recursively, if the `recursive` flag is set).  - Constructs a prompt containing the collected file contents.  - Sends the prompt to an LLM (GPT-4o or Gemini-2.0-flash, based on the `model` option) via an API call (API URL is configurable via command line). - Writes the generated content to a `README.md` file in the target directory. | None (API call not implemented in the current version)                  |
| `service/generateCopilotInstructionsService.ts` | Generates Copilot configuration instructions | - (Currently unimplemented) Aims to collect `README.md` content and any existing Copilot configuration files. - (Currently unimplemented) Would then send this information to an LLM to generate Copilot configuration instructions in a suitable format (e.g., `copilot.json`). - (Currently unimplemented) Finally, would write the generated configuration to a file. | None (LLM integration and file writing are not implemented)           |

## Code Style and Examples

- **Asynchronous Operations:** Use `async/await` for handling asynchronous operations to improve code readability and maintainability.

  ```typescript
  async function generateReadme(folderPath: string): Promise<void> {
    // ...
  }
  ```

- **Error Handling:** Implement robust error handling using `try/catch` blocks to gracefully handle potential errors during execution.

  ```typescript
  try {
    // ...
  } catch (error) {
    console.error('Error:', error);
  }
  ```

## File Templates and Explanations

- Currently, no specific file templates are defined beyond the structure dictated by the TypeScript code within each service. The output file (`README.md`) is generated dynamically based on the LLM's response.

## Coding Rules

- **Strict TypeScript:** Leverage TypeScript's features, including interfaces, classes, and generics, to write maintainable and type-safe code.
- **Single Responsibility Principle:** Adhere to the Single Responsibility Principle, ensuring that each function has a single, well-defined purpose.
- **Clear Documentation:** Write clear and concise comments to explain the purpose of functions and complex logic.
- **Graceful Error Handling:** Implement proper error handling and logging mechanisms to handle errors gracefully and provide informative messages.
- **Consistent Naming:** Follow the established naming conventions consistently throughout the codebase.

## Notes for Developers

- **LLM Integration:** The LLM integration with OpenAI or Gemini is **not fully implemented**. The code includes placeholders for API calls but requires implementation of the actual API request logic. Developers will need to choose an appropriate HTTP client library (e.g., `axios`, `node-fetch`) and implement the necessary API calls to the chosen LLM service.
- **Error Handling**: Add appropriate error handling for API requests, including checking the status code and logging errors.
- **Logging:** Comprehensive logging is currently missing. Implement logging to track the execution flow, record errors, and aid in debugging. Consider using a logging library like `winston` or `pino`.
- **Unit Testing:** Unit tests are **not implemented**. Writing unit tests is crucial for ensuring the correctness and reliability of the code. Use a testing framework like `Jest` or `Mocha` to write unit tests for each service and function.
- **API Key Security:** The API key is currently passed via command-line arguments. This is insecure. Implement a more secure mechanism for handling API keys, such as reading them from environment variables or a configuration file.
- **Rate Limiting:** Implement rate limiting to prevent exceeding the API limits of the LLM service.
- **Command Line Parameters:** The tool's behavior is configured through command-line parameters, offering flexibility in target directory, LLM model, API key, API URL, and recursive search.
