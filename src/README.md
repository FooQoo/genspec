# src/

## Overview

- **Folder name:** src
- **Purpose:** This folder contains the TypeScript source code for a command-line tool designed to automate the creation of `README.md` files and Copilot configuration instructions. It leverages the `commander` library for command-line argument parsing. The tool aims to integrate with Large Language Models (LLMs) such as OpenAI's GPT models or Google's Gemini models to dynamically generate content based on the contents of a specified directory. The architecture is modular, designed for easy extension with different LLM providers and functionalities.

## Naming Conventions

- File names use PascalCase with the `.ts` extension (e.g., `GenerateReadmeService.ts`).
- Function names use camelCase (e.g., `generateReadmeService`).
- Variable names use camelCase.
- Interfaces are prefixed with `I` (e.g., `IGenerateReadmeOptions`).

## Design Policy

- The codebase emphasizes a modular design, separating concerns into distinct services.
- `index.ts` serves as the entry point to the program, handling command-line argument parsing and coordinating the execution flow.
- Services encapsulate the core logic for generating README files and Copilot instructions. This design promotes reusability and maintainability.

## Technologies and Libraries Used

- TypeScript: The primary programming language, providing strong typing and modern language features.
- Commander: A Node.js library for building command-line interfaces, used for parsing command-line arguments and options.
- Node.js: The runtime environment for executing the TypeScript code.
- File System API (`fs` module): Used for reading file contents (implicitly used within the services).

## File Roles

| File Name                             | Role                                                 | Logic and Functions                                                                                                                                                                                                                                                                                                                                                        | Names of other files used                                                |
| ------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `index.ts`                            | Entry point and command handler                      | - Initializes the Commander program.  - Defines command-line options and arguments for the `readme` and `copilot` commands.  - Parses the command-line arguments provided by the user.  - Dispatches execution to the appropriate service (`GenerateReadmeService` or `generateCopilotInstructionsService`) based on the specified command.  - Passes user-provided options (directory, model, API key, API URL, recursive flag, language, env mode) to the services. - If `env-mode` is enabled, loads the API key and URL from environment variables. - If `env-mode` is enabled, throws an error if the required environment variables are not present. | `GenerateReadmeService.ts`, `service/generateCopilotInstructionsService.ts` |
| `service/GenerateReadmeService.ts`    | Generates a `README.md` file                      | - Accepts a configuration object containing the folder path, LLM model, API key, API URL, recursive flag, and language.  - Reads the contents of files from the specified directory (recursively if the `recursive` flag is set).  - Constructs a prompt containing the collected file contents.  - Sends the prompt to the LLM (GPT-4o or Gemini-2.0-flash based on the `model` option) via an API call (API URL is configurable via command line). - Writes the generated content to a `README.md` file in the target directory. | None (API call is not fully implemented in the current version)                  |
| `service/generateCopilotInstructionsService.ts` | Generates Copilot configuration instructions | - Accepts a configuration object containing the root directory, LLM model, API key, API URL, and language. - (Currently unimplemented) Aims to gather `README.md` content and existing Copilot configuration files. - (Currently unimplemented) Then, sends this information to an LLM to generate Copilot configuration instructions in the appropriate format (e.g., `copilot.json`). - (Currently unimplemented) Finally, writes the generated configuration to a file. | None (LLM integration and file writing are not implemented)           |

## Code Style and Examples

- **Asynchronous Operations:** Use `async/await` to handle asynchronous operations for improved code readability and maintainability.

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

- Currently, no specific file templates are defined beyond the structure dictated by the TypeScript code within each service. The output files (`README.md` or Copilot configuration files) are generated dynamically based on the LLM's responses.

## Coding Rules

- **Strict TypeScript:** Leverage TypeScript features such as interfaces, classes, and generics to write maintainable and type-safe code.
- **Single Responsibility Principle:** Adhere to the single responsibility principle, ensuring that each function has a single, well-defined purpose.
- **Clear Documentation:** Write clear and concise comments to explain the purpose of functions and any complex logic.
- **Graceful Error Handling:** Implement proper error handling and logging mechanisms to handle errors gracefully and provide informative messages.
- **Consistent Naming:** Consistently follow established naming conventions throughout the codebase.
- **Environment Variable Handling:** When using `env-mode`, validate the presence of required environment variables early to prevent unexpected errors.

## Notes for Developers

- **LLM Integration:** The LLM integration with OpenAI or Gemini is **not fully implemented**. The code includes placeholders for API calls, but the actual API request logic needs to be implemented. Developers should select an appropriate HTTP client library (e.g., `axios`, `node-fetch`) and implement the necessary API calls for the chosen LLM service.
- **Error Handling**: Add proper error handling for API requests, including checking status codes and logging errors.
- **Logging:** Comprehensive logging is currently lacking. Implement logging to track the execution flow, record errors, and aid in debugging. Consider using a logging library like `winston` or `pino`.
- **Unit Testing:** Unit tests are **not implemented**. Creating unit tests is crucial to ensure the accuracy and reliability of the code. Use a testing framework like `Jest` or `Mocha` to create unit tests for each service and function.
- **API Key Security:** API keys are currently passed via command-line arguments. This is not secure. Implement a more secure mechanism, such as reading API keys from environment variables or a configuration file. The `env-mode` flag provides a starting point for fetching API keys from environment variables, but further enhancements are needed to ensure security best practices.
- **Rate Limiting:** Implement rate limiting to avoid exceeding the API limits of the LLM services.
- **Language Support:** The `--language` option has been added, allowing you to specify the output language (`ja`, `en`, `ko`, `zh`) in the `readme` and `copilot` commands. The default is English (`en`).
- **Command Line Parameters:** The tool's behavior is configured with command-line parameters that allow you to flexibly set the target directory, LLM model, API key, API URL, recursive search, and output language. The `env-mode` parameter allows you to read the API key from environment variables.

## index.ts

```typescript
import { Command } from 'commander';
import { generateReadmeService } from "./service/GenerateReadmeService";
import { generateCopilotInstructionsService } from "./service/generateCopilotInstructionsService";

const program = new Command();

program
  .command('readme')
  .description('Generate a README file based on folder contents')
  .option('-d, --directory <path>', 'Target directory', process.cwd())
  .option('-m, --model <model>', 'LLM model (gpt-4o/gemini-2.0-flash)')
  .option('--llm-api-key <key>', 'API key')
  .option('--llm-api-url <url>', 'API URL')
  .option('-r, --recursive', 'Recursively search files in subdirectories', false)
  .option('-l, --language <language>', 'Language for the output (ja/en/ko/zh)', 'en')
  .option('--env-mode', 'Load API key and URL from environment variables')
  .action(async (opts) => {
    let apiKey = opts.llmApiKey;
    let apiUrl = opts.llmApiUrl;

    if (opts.envMode) {
      apiKey = process.env.LLM_API_KEY;
      apiUrl = process.env.LLM_API_URL;

      if (!apiKey && !apiUrl) {
        throw new Error('LLM_API_KEY or LLM_API_URL environment variables must be set when using --env-mode');
      }
    }

    const language = opts.language || 'en';

    await generateReadmeService({
      folderPath: opts.directory,
      model: opts.model,
      apiKey: apiKey,
      apiUrl: apiUrl,
      recursive: opts.recursive,
      language: language,
    });
  });

program
  .command('copilot')
  .description('Generate a Copilot configuration file by integrating all README.md and existing copilot-instructions....')
  .option('-d, --directory <path>', 'Target directory', process.cwd())
  .option('-m, --model <model>', 'LLM model (gpt-4o/gemini-2.0-flash)', 'gpt-4o')
  .option('--llm-api-key <key>', 'API key')
  .option('--llm-api-url <url>', 'API URL')
  .option('-l, --language <language>', 'Language for the output (ja/en/ko/zh)', 'en')
  .option('--env-mode', 'Load API key and URL from environment variables')
  .action(async (opts) => {
    let apiKey = opts.llmApiKey;
    let apiUrl = opts.llmApiUrl;

    if (opts.envMode) {
      apiKey = process.env.LLM_API_KEY;
      apiUrl = process.env.LLM_API_URL;

      if (!apiKey && !apiUrl) {
        throw new Error('LLM_API_KEY or LLM_API_URL environment variables must be set when using --env-mode');
      }
    }

   const language = opts.language || 'en';

    await generateCopilotInstructionsService({
      rootDir: opts.directory,
      model: opts.model,
      apiKey: apiKey,
      apiUrl: apiUrl,
      language: language,
    });
  });

program.parse();
```

## index.ts
```
import { Command } from 'commander';
import { generateReadmeService } from "./service/GenerateReadmeService";
import { generateCopilotInstructionsService } from "./service/generateCopilotInstructionsService";

const program = new Command();

program
  .command('readme')
  .description('Generate a README file based on folder contents')
  .option('-d, --directory <path>', 'Target directory', process.cwd())
  .option('-m, --model <model>', 'LLM model (gpt-4o/gemini-2.0-flash)')
  .option('--llm-api-key <key>', 'API key')
  .option('--llm-api-url <url>', 'API URL')
  .option('-r, --recursive', 'Recursively search files in subdirectories', false)
  .option('-l, --language <language>', 'Language for the output (ja/en/ko/zh)', 'en')
  .option('--env-mode', 'Load API key and URL from environment variables')
  .action(async (opts) => {
    let apiKey = opts.llmApiKey;
    let apiUrl = opts.llmApiUrl;

    if (opts.envMode) {
      apiKey = process.env.LLM_API_KEY;
      apiUrl = process.env.LLM_API_URL;

      if (!apiKey && !apiUrl) {
        throw new Error('LLM_API_KEY or LLM_API_URL environment variables must be set when using --env-mode');
      }
    }

    const language = opts.language || 'en';

    await generateReadmeService({
      folderPath: opts.directory,
      model: opts.model,
      apiKey: apiKey,
      apiUrl: apiUrl,
      recursive: opts.recursive,
      language: language,
    });
  });

program
  .command('copilot')
  .description('Generate a Copilot configuration file by integrating all README.md and existing copilot-instructions....
  .option('-d, --directory <path>', 'Target directory', process.cwd())
  .option('-m, --model <model>', 'LLM model (gpt-4o/gemini-2.0-flash)', 'gpt-4o')
  .option('--llm-api-key <key>', 'API key')
  .option('--llm-api-url <url>', 'API URL')
  .option('-l, --language <language>', 'Language for the output (ja/en/ko/zh)', 'en')
  .option('--env-mode', 'Load API key and URL from environment variables')
  .action(async (opts) => {
    let apiKey = opts.llmApiKey;
    let apiUrl = opts.llmApiUrl;

    if (opts.envMode) {
      apiKey = process.env.LLM_API_KEY;
      apiUrl = process.env.LLM_API_URL;

      if (!apiKey && !apiUrl) {
        throw new Error('LLM_API_KEY or LLM_API_URL environment variables must be set when using --env-mode');
      }
    }

   const language = opts.language || 'en';

    await generateCopilotInstructionsService({
      rootDir: opts.directory,
      model: opts.model,
      apiKey: apiKey,
      apiUrl: apiUrl,
      language: language,
    });
  });

program.parse();

```

## index.ts
```
import { Command } from 'commander';
import { generateReadmeService } from "./service/GenerateReadmeService";
import { generateCopilotInstructionsService } from "./service/generateCopilotInstructionsService";

const program = new Command();

program
  .command('readme')
  .description('Generate a README file based on folder contents')
  .option('-d, --directory <path>', 'Target directory', process.cwd())
  .option('-m, --model <model>', 'LLM model (gpt-4o/gemini-2.0-flash)')
  .option('--llm-api-key <key>', 'API key')
  .option('--llm-api-url <url>', 'API URL')
  .option('-r, --recursive', 'Recursively search files in subdirectories', false)
  .option('-l, --language <language>', 'Language for the output (ja/en/ko/zh)', 'en')
  .option('--env-mode', 'Load API key and URL from environment variables')
  .action(async (opts) => {
    let apiKey = opts.llmApiKey;
    let apiUrl = opts.llmApiUrl;

    if (opts.envMode) {
      apiKey = process.env.LLM_API_KEY;
      apiUrl = process.env.LLM_API_URL;

      if (!apiKey && !apiUrl) {
        throw new Error('LLM_API_KEY or LLM_API_URL environment variables must be set when using --env-mode');
      }
    }

    const language = opts.language || 'en';

    await generateReadmeService({
      folderPath: opts.directory,
      model: opts.model,
      apiKey: apiKey,
      apiUrl: apiUrl,
      recursive: opts.recursive,
      language: language,
    });
  });

program
  .command('copilot')
  .description('Generate a Copilot configuration file by integrating all README.md and existing copilot-instructions....
  .option('-d, --directory <path>', 'Target directory', process.cwd())
  .option('-m, --model <model>', 'LLM model (gpt-4o/gemini-2.0-flash)', 'gpt-4o')
  .option('--llm-api-key <key>', 'API key')
  .option('--llm-api-url <url>', 'API URL')
  .option('-l, --language <language>', 'Language for the output (ja/en/ko/zh)', 'en')
  .option('--env-mode', 'Load API key and URL from environment variables')
  .action(async (opts) => {
    let apiKey = opts.llmApiKey;
    let apiUrl = opts.llmApiUrl;

    if (opts.envMode) {
      apiKey = process.env.LLM_API_KEY;
      apiUrl = process.env.LLM_API_URL;

      if (!apiKey && !apiUrl) {
        throw new Error('LLM_API_KEY or LLM_API_URL environment variables must be set when using --env-mode');
      }
    }

   const language = opts.language || 'en';

    await generateCopilotInstructionsService({
      rootDir: opts.directory,
      model: opts.model,
      apiKey: apiKey,
      apiUrl: apiUrl,
      language: language,
    });
  });

program.parse();

```
