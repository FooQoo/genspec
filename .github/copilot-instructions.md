# Copilot Instructions

This document provides instructions and guidelines for using GitHub Copilot within this project. It covers project structure, coding conventions, and specific instructions for generating `README.md` and Copilot configuration files.

## Project Overview

This project provides a command-line tool to automate the creation of `README.md` files and Copilot configuration instructions. It leverages LLMs to generate content based on directory contents. The architecture is modular, designed for easy extension with different LLM providers.

## Folder Structure

-   `src/`: Contains the TypeScript source code.
    -   `index.ts`: Entry point for the command-line tool.
    -   `service/`: Contains service files with business logic.
    -   `repository/`: Contains logic for interacting with different LLMs.

## Naming Conventions

-   **File Names:** PascalCase with `.ts` extension (e.g., `GenerateReadmeService.ts`).
-   **Function Names:** camelCase (e.g., `generateReadmeService`).
-   **Variable Names:** camelCase.
-   **Interfaces:** Prefixed with `I` (e.g., `IGenerateReadmeOptions`).
-   **Class Names (repository):** PascalCase (e.g., `GeminiClient`, `OpenAIClient`).
-   **Interface Names (repository):** PascalCase (e.g., `LLMRepository`, `GeminiConfig`, `OpenAIConfig`).

## Design Policy

-   **Modular Design:** Separate concerns into distinct services and repositories.
-   **Abstraction (repository):**  Abstract LLM interaction behind a common interface (`LLMRepository`).
-   **Flexibility (repository):** Code should be flexible to support different LLMs and configurations.
-   **Error Handling (repository):** Robust error handling for API failures.
-   **Configuration (repository):** LLM configurations easily configurable through configuration objects.
-   **Thin Services:** Services should be focused on orchestration.
-   **Data Access:** Services should not directly access data sources.
-   **Input Validation:** Services should perform input validation.

## Technologies and Libraries

-   TypeScript
-   Commander
-   Node.js
-   File System API (`fs` module)
-   `path` (Node.js)
-   `openai` (OpenAI Node.js library)
-   `@google/genai` (Google's GenAI Node.js library)

## Coding Rules

-   **Strict TypeScript:** Use interfaces, classes, and generics.
-   **Single Responsibility Principle:** Each function should have a single, well-defined purpose.
-   **Clear Documentation:**  Write clear and concise comments.
-   **Graceful Error Handling:** Implement error handling and logging.
-   **Consistent Naming:**  Follow established naming conventions.
-   **Environment Variable Handling:** Validate the presence of required environment variables early when using `env-mode`.
-   **LLM Clients Implementation (repository):** All LLM clients must implement the `LLMRepository` interface.
-   **Dependency Injection (repository):** Use dependency injection for configuration parameters.
-   **Immutability:** Prefer immutability.

## Important Notes

-   **LLM Integration:** The actual API request logic for OpenAI and Gemini is **not fully implemented**. Use `axios` or `node-fetch` to implement API calls. Add proper error handling for API requests.
-   **Unit Testing:** Unit tests are **not implemented**. Create unit tests for each service and function using `Jest` or `Mocha`.
-   **API Key Security:** API keys are currently passed via command-line arguments, which is insecure. Implement a more secure mechanism like environment variables or a configuration file.
-   **Rate Limiting:** Implement rate limiting to avoid exceeding LLM API limits.
-   **Language Support:** The `--language` option specifies the output language (`ja`, `en`, `ko`, `zh`). The default is English (`en`).
-   **Consistent Error Handling (service):** Services implement basic error handling (e.g., checking if a directory exists) and should throw exceptions or return error codes as appropriate.
-   **Code Comments (service):** Add clear and concise comments to explain complex logic and important decisions.
-   **Unit Testing (service):** Write comprehensive unit tests to ensure the correctness of service functions.

## Command-Line Interface

The tool provides two commands: `readme` and `copilot`.

### `readme` Command

Generates a `README.md` file based on folder contents.

```
readme
  .description('Generate a README file based on folder contents')
  .option('-d, --directory <path>', 'Target directory', process.cwd())
  .option('-m, --model <model>', 'LLM model (gpt-4o/gemini-2.0-flash)')
  .option('--llm-api-key <key>', 'API key')
  .option('--llm-api-url <url>', 'API URL')
  .option('-r, --recursive', 'Recursively search files in subdirectories', false)
  .option('-l, --language <language>', 'Language for the output (ja/en/ko/zh)', 'en')
  .option('--env-mode', 'Load API key and URL from environment variables')
```

**Options:**

-   `-d, --directory <path>`: Target directory (default: current working directory).
-   `-m, --model <model>`: LLM model (`gpt-4o` or `gemini-2.0-flash`).
-   `--llm-api-key <key>`: API key.
-   `--llm-api-url <url>`: API URL.
-   `-r, --recursive`: Recursively search files in subdirectories (default: `false`).
-   `-l, --language <language>`: Language for the output (default: `en`).
-   `--env-mode`: Load API key and URL from environment variables.

### `copilot` Command

Generates a Copilot configuration file by integrating all `README.md` files.

```
copilot
  .description('Generate a Copilot configuration file by integrating all README.md and existing copilot-instructions....')
  .option('-d, --directory <path>', 'Target directory', process.cwd())
  .option('-m, --model <model>', 'LLM model (gpt-4o/gemini-2.0-flash)', 'gpt-4o')
  .option('--llm-api-key <key>', 'API key')
  .option('--llm-api-url <url>', 'API URL')
  .option('-l, --language <language>', 'Language for the output (ja/en/ko/zh)', 'en')
  .option('--env-mode', 'Load API key and URL from environment variables')
```

**Options:**

-   `-d, --directory <path>`: Target directory (default: current working directory).
-   `-m, --model <model>`: LLM model (`gpt-4o` or `gemini-2.0-flash`) (default: `gpt-4o`).
-   `--llm-api-key <key>`: API key.
-   `--llm-api-url <url>`: API URL.
-   `-l, --language <language>`: Language for the output (default: `en`).
-   `--env-mode`: Load API key and URL from environment variables.

## Usage Examples

### Generating a `README.md` file

```bash
node dist/index.js readme -d ./src -m gpt-4o --llm-api-key YOUR_API_KEY
```

### Generating a `README.md` file recursively in Japanese

```bash
node dist/index.js readme -d ./src -m gpt-4o --llm-api-key YOUR_API_KEY -r -l ja
```

### Generating a Copilot configuration file

```bash
node dist/index.js copilot -d ./ -m gpt-4o --llm-api-key YOUR_API_KEY
```

### Using environment variables for API key and URL

```bash
LLM_API_KEY=YOUR_API_KEY LLM_API_URL=YOUR_API_URL node dist/index.js readme -d ./src -m gpt-4o --env-mode
```

## Service Details

### `generateReadmeService.ts`

-   Generates or updates a `README.md` file for a given directory, using an LLM.  Can operate recursively.
-   Reads file contents, generates summaries, and constructs a prompt for the LLM.
-   Limits the number of characters per line of the code snippets in `README.md`. `MAX_LINE_LENGTH` is set to 120.
-   Uses `findSubdirectories` to recursively find subdirectories.

### `generateCopilotInstructionsService.ts`

-   Generates a `copilot-instructions.md` file by integrating existing `README.md` files.
-   Uses `findAllReadmesRecursively` to find all `README.md` files recursively.
-   Constructs a prompt instructing the LLM to generate a `copilot-instructions.md` file.
-   Always resolves `.github` directory relative to the current working directory.

## Code Snippets

### `generateCopilotInstructionsService.ts`
```typescript
import fs from 'fs';
import path from 'path';
import { getLLMRepository } from '../repository/llm';

function findAllReadmesRecursively(rootDir: string): string[] {
  let readmes: string[] = [];
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      readmes = readmes.concat(findAllReadmesRecursively(fullPath));
    } else if (entry.isFile() && entry.name.toLowerCase() === 'readme.md') {
      readmes.push(fullPath);
    }
  }
  return readmes;
}

export async function generateCopilotInstructionsService({
  rootDir,
  model,
  apiKey,
  apiUrl,
  language = 'en',
}: {
  rootDir: string;
  model: string;
  apiKey: string;
  apiUrl?: string;
  language?: string;
}) {
  // Always resolve .github relative to the current working directory
  const cwd = process.cwd();
  const githubDir = path.join(cwd, '.github');
  const outputPath = path.join(githubDir, 'copilot-instructions.md');

  // 1. Collect all README.md files recursively
  const readmePaths = findAllReadmesRecursively(rootDir);
  // 2. Read and concatenate all README contents
  const allReadmeContents = readmePaths
    .map((filePath) => {
      const rel = path.relative(rootDir, filePath);
      const content = fs.readFileSync(filePath, 'utf-8');
      return `# ${rel}\n\n${content.trim()}\n`;
    })
    .join('\n---\n');

  // 3. Generate copilot-instructions.md using LLM (READMEのみプロンプトに含める)
  const prompt = `You are to create a single copilot-instructions.md file for the entire project, based only on the following README.md files.  The copilot-instructions.md file should provide context to GitHub Copilot about the project, including a description of the project's purpose, architecture, key components, and coding conventions.  It should also include information about how to use the project's API, how to contribute to the project, and any other information that would be helpful for developers using GitHub Copilot to work on the project. Ensure the generated file is in valid markdown format.`;

  const successMessage = `✅ Copilot instructions generated: ${outputPath}`;
  const failureMessage = `❌ Failed to generate copilot-instructions.md`;

  const llm = await getLLMRepository({ model, apiKey, apiUrl });
  let instructionContent = await llm.call(prompt + '\n\n---\n\n# All README files\n' + allReadmeContents);
  // Ensure .github directory exists in cwd
  if (!fs.existsSync(githubDir)) {
    fs.mkdirSync(githubDir);
  }
  fs.writeFileSync(outputPath, instructionContent || '');
  if (instructionContent) {
    console.log(successMessage);
  } else {
    console.error(failureMessage);
  }
}

```

### `generateReadmeService.ts`

```typescript
import fs from 'fs';
import path from 'path';
import { getLLMRepository } from '../repository/llm';

function findSubdirectories(folderPath: string): string[] {
  return fs.readdirSync(folderPath, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => path.join(folderPath, entry.name));
}


const MAX_LINE_LENGTH = 120; // Maximum characters per line

export async function generateReadmeService({
  folderPath,
  model,
  apiKey,
  apiUrl,
  recursive = false,
  language = 'en',
}: {
  folderPath: string;
  model: string;
  apiKey: string;
  apiUrl?: string;
  recursive?: boolean;
  language?: string;
}) {
  if (!fs.existsSync(folderPath)) {
    console.error(`Directory not found: ${folderPath}`);
    return;
  }
  // 1. Generate README for this folder only
  const files = fs.readdirSync(folderPath).filter(f => fs.statSync(path.join(folderPath, f)).isFile());
  const fileSummaries = files
    // Exclude readme.md
    .filter(file => file.toLowerCase() !== 'readme.md')
    // Convert file name to relative path
    .map(file => {
      const rel = path.relative(folderPath, path.join(folderPath, file));
      const content = fs.readFileSync(path.join(folderPath, file), 'utf-8');

      // Limit the number of characters per line
      const lines = content.split('\n').map(line => {
        if (line.length > MAX_LINE_LENGTH) {
          const truncatedLine = line.substring(0, MAX_LINE_LENGTH - 3) + '...';
          return truncatedLine; // Returns the abbreviated line
        }
        return line;
      });

      return `## ${rel}\n\`\`\`\n${lines.join('\n')}\n\`\`\``;
    })
    .join('\n\n');
  // Read existing README.md if present
  let existingReadme = '';
  const readmePath = path.join(folderPath, 'README.md');
  if (fs.existsSync(readmePath)) {
    existingReadme = fs.readFileSync(readmePath, 'utf-8');
  }
  const prompt = `Based on the contents of the files in the following folder, update the README.md so that it describes the purpose, rules, and roles of the files in this folder.
If a README.md already exists, use its content as a base and update it to reflect the current state of the folder. Return valid markdown. Include file contents as needed to provide context.
\n${fileSummaries}\n\n Existing README.md content:\n${existingReadme}`;
  const llm = await getLLMRepository({ model, apiKey, apiUrl });
  const content = await llm.call(prompt);
  const outputPath = path.join(folderPath, 'README.md');
  if (content) {
    fs.writeFileSync(outputPath, content);
    console.log(`✅ README.md generated: ${outputPath}`);
  } else {
    console.error('❌ Failed to generate README.md');
  }
  // 2. If recursive is true, apply the same process recursively to subdirectories
  if (recursive) {
    const subdirs = findSubdirectories(folderPath);
    for (const subdir of subdirs) {
      await generateReadmeService({
        folderPath: subdir,
        model,
        apiKey,
        apiUrl,
        recursive: true,
        language,
      });
    }
  }
}

```

## LLM Repository Interface

```typescript
export interface LLMRepository {
  call(prompt: string): Promise<string>;
}
```

## Client Implementation Example (GeminiClient)

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

## Factory Function Example (getLLMRepository)

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

## LLM Client Template

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


---

# All README files
# README.md

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

---
# repository/README.md

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

---
# service/README.md

# src/service/ README.md

## Overview

**Folder name:** service

**Purpose:** The `service` folder encapsulates the application's business logic. It acts as a layer between API endpoints (controllers) and the data access layer (repositories). Services are responsible for orchestrating data retrieval, manipulation, and validation before passing data to the presentation layer or storing it in the database. This separation of concerns promotes maintainability, testability, and reusability of the core application logic.

## Naming conventions

*   Service file functions should use camel case for function names (e.g., `generateReadmeService`).
*   Service files should end with the suffix `Service` (e.g., `generateReadmeService.ts`).
*   Related functions should be grouped within the same service file.

## Design policy

*   Services should be thin and focused on orchestration, delegating complex operations to other modules like repositories or utility functions.
*   Services should not directly access data sources; this is the responsibility of repositories.
*   Services should perform input validation and error handling.
*   Services should be designed to be easily testable, potentially through dependency injection.

## Technologies and libraries used

*   **fs (Node.js):** Used for file system operations (reading directories, reading/writing files, checking file existence).
*   **path (Node.js):** Used for constructing and manipulating file paths.
*   **`../repository/llm`:** A custom repository module for interacting with a Large Language Model (LLM). This likely handles API calls to the LLM.

## File Roles and Responsibilities

| File name                                     | Role                                                                                                         | Logic and Functions                                                                                                                                                                                                                                                                                                                                              | Names of other files used |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `generateCopilotInstructionsService.ts`       | Generates GitHub Copilot instructions recursively based on existing README files.                               | `findAllReadmesRecursively`: Recursively searches a directory and its subdirectories to find `README.md` files.<br/>`generateCopilotInstructionsService`: Orchestrates the process of finding READMEs, reading their content, and using an LLM to generate Copilot instructions, which are written to `.github/copilot-instructions.md`. Resolves `.github` relative to the current working directory. Includes all found README files to the generated copilot instructions file. | `../repository/llm`      |
| `generateReadmeService.ts`                    | Generates README files for specified directories, optionally recursively.                                   | `findSubdirectories`: Finds all subdirectories within a given folder.<br/>`generateReadmeService`: Orchestrates the README generation process for a given folder, potentially calling an LLM repository. Can also operate recursively on all subfolders. Reads the contents of files in a folder and prepares them for the LLM.  Also truncates lines exceeding a defined maximum length. | `../repository/llm`      |

## Code style and examples

*   **Asynchronous Operations:** Services use `async/await` to handle asynchronous operations such as reading files and calling the LLM repository.

    ```typescript
    export async function generateReadmeService({ folderPath, model, apiKey, apiUrl }: { folderPath: string; model: string; apiKey: string; apiUrl?: string; }) {
      // ... asynchronous operations using await ...
    }
    ```

*   **Error Handling:** Services implement basic error handling (e.g., checking if a directory exists) and should throw exceptions or return error codes as appropriate.

    ```typescript
    if (!fs.existsSync(folderPath)) {
      console.error(`Directory not found: ${folderPath}`);
      return;
    }
    ```

*   **File System Operations:** The `fs` module is used extensively for interacting with the file system. Ensure proper error handling when using `fs` functions.

    ```typescript
    const files = fs.readdirSync(folderPath).filter(f => fs.statSync(path.join(folderPath, f)).isFile());
    ```

## File templates and explanations

A common service file structure:

```typescript
import { getLLMRepository } from '../repository/llm'; // Example dependency
import fs from 'fs';
import path from 'path';

// Helper function (optional)
function helperFunction(): void {
  // ...
}

export async function serviceFunction({ /* Input parameters */ }: { /* Parameter types */ }): Promise<void> {
  try {
    // 1. Input validation
    // ...

    // 2. Data retrieval and processing (using repository or other services)
    const llm = getLLMRepository();
    // ...

    // 3. Business logic
    // ...

    // 4. Return result
    return ;
  } catch (error) {
    console.error("Error in serviceFunction:", error);
    throw error; // Or return an error code/message
  }
}
```

## Coding rules

*   **Single Responsibility Principle:** Each service function should have a clear and focused purpose.
*   **Dependency Injection:** Use dependency injection to inject dependencies (e.g., repositories) into services to improve testability and maintainability.
*   **Error Handling:** Implement robust error handling to gracefully handle potential errors.
*   **Logging:** Use a logging mechanism to log important events and errors for debugging purposes.
*   **Asynchronous Operations:** Handle asynchronous operations properly using `async/await`.
*   **Immutability:** Prefer immutability whenever possible to prevent unexpected side effects.
*   **Code Comments:** Add clear and concise comments to explain complex logic and important decisions.
*   **Unit Testing:** Write comprehensive unit tests to ensure the correctness of service functions.

## Notes for developers

*   When modifying existing services, avoid introducing breaking changes without careful consideration.
*   Always update unit tests when changing service functions.
*   When adding new dependencies, ensure they are well-documented and do not introduce security vulnerabilities.
*   Consider using a code formatter (e.g., Prettier) and linter (e.g., ESLint) to enforce code style consistency.

## Detailed file explanations:

### generateCopilotInstructionsService.ts

This service is responsible for generating a `copilot-instructions.md` file that provides context and instructions to GitHub Copilot for understanding the project.

**Key Functions:**

*   `generateCopilotInstructionsService`: This function orchestrates the entire process.
    *   Recursively finds all `README.md` files within a specified root directory.
    *   Reads the content of each `README.md` file.
    *   Concatenates the content of all `README.md` files into a single string.
    *   Constructs a prompt instructing the LLM to generate a `copilot-instructions.md` file based on the concatenated `README.md` content.
    *   Calls the LLM repository to execute the prompt and generate the content for `copilot-instructions.md`.
    *   Writes the generated content to the `.github/copilot-instructions.md` file (creating the `.github` directory if it doesn't exist).
    *   Logs a success or failure message to the console.

**Helper Functions:**

*   `findAllReadmesRecursively`: This function recursively searches a directory and its subdirectories for `README.md` files and returns an array of their paths.

**Example Usage:**

```typescript
import { generateCopilotInstructionsService } from './generateCopilotInstructionsService';

async function main() {
  try {
    await generateCopilotInstructionsService({
      rootDir: './', // The root directory to search for READMEs
      model: 'gpt-4', // The LLM model to use
      apiKey: 'YOUR_API_KEY', // Your LLM API key
    });
  } catch (error) {
    console.error('Failed to generate Copilot instructions:', error);
  }
}

main();
```

### generateReadmeService.ts

This service is responsible for generating or updating a `README.md` file for a given directory, potentially including summaries of the files within that directory and using an LLM to generate the final content. It can also recursively generate READMEs for all subdirectories.

**Key Functions:**

*   `generateReadmeService`: This function orchestrates the README generation process.
    *   Reads the content of all files (excluding `README.md`) within the specified directory.
    *   Generates a summary of each file, including its filename and truncated content (limited line length).
    *   Constructs a prompt instructing the LLM to generate or update a `README.md` file based on the file summaries and any existing `README.md` content.
    *   Calls the LLM repository to execute the prompt and generate the content for `README.md`.
    *   Writes the generated content to the `README.md` file in the specified directory.
    *   If `recursive` is true, calls itself recursively for each subdirectory.
    *   Logs a success or failure message to the console.

**Helper Functions:**

*   `findSubdirectories`: This function finds all subdirectories within a given folder and returns an array of their paths.

**Example Usage:**

```typescript
import { generateReadmeService } from './generateReadmeService';

async function main() {
  try {
    await generateReadmeService({
      folderPath: './src', // The directory to generate a README for
      model: 'gpt-4', // The LLM model to use
      apiKey: 'YOUR_API_KEY', // Your LLM API key
      recursive: true, // Also generate READMEs for subdirectories
    });
  } catch (error) {
    console.error('Failed to generate README:', error);
  }
}

main();
```

## Code Snippets:

### generateCopilotInstructionsService.ts

```typescript
import fs from 'fs';
import path from 'path';
import { getLLMRepository } from '../repository/llm';

function findAllReadmesRecursively(rootDir: string): string[] {
  let readmes: string[] = [];
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      readmes = readmes.concat(findAllReadmesRecursively(fullPath));
    } else if (entry.isFile() && entry.name.toLowerCase() === 'readme.md') {
      readmes.push(fullPath);
    }
  }
  return readmes;
}

export async function generateCopilotInstructionsService({
  rootDir,
  model,
  apiKey,
  apiUrl,
  language = 'en',
}: {
  rootDir: string;
  model: string;
  apiKey: string;
  apiUrl?: string;
  language?: string;
}) {
  // Always resolve .github relative to the current working directory
  const cwd = process.cwd();
  const githubDir = path.join(cwd, '.github');
  const outputPath = path.join(githubDir, 'copilot-instructions.md');

  // 1. Collect all README.md files recursively
  const readmePaths = findAllReadmesRecursively(rootDir);
  // 2. Read and concatenate all README contents
  const allReadmeContents = readmePaths
    .map((filePath) => {
      const rel = path.relative(rootDir, filePath);
      const content = fs.readFileSync(filePath, 'utf-8');
      return `# ${rel}\n\n${content.trim()}\n`;
    })
    .join('\n---\n');

  // 3. Generate copilot-instructions.md using LLM (READMEのみプロンプトに含める)
  const prompt = `You are to create a single copilot-instructions.md file for the entire project, based only on the following README.md files.  The copilot-instructions.md file should provide context to GitHub Copilot about the project, including a description of the project's purpose, architecture, key components, and coding conventions.  It should also include information about how to use the project's API, how to contribute to the project, and any other information that would be helpful for developers using GitHub Copilot to work on the project. Ensure the generated file is in valid markdown format.`;

  const successMessage = `✅ Copilot instructions generated: ${outputPath}`;
  const failureMessage = `❌ Failed to generate copilot-instructions.md`;

  const llm = await getLLMRepository({ model, apiKey, apiUrl });
  let instructionContent = await llm.call(prompt + '\n\n---\n\n# All README files\n' + allReadmeContents);
  // Ensure .github directory exists in cwd
  if (!fs.existsSync(githubDir)) {
    fs.mkdirSync(githubDir);
  }
  fs.writeFileSync(outputPath, instructionContent || '');
  if (instructionContent) {
    console.log(successMessage);
  } else {
    console.error(failureMessage);
  }
}

```

### generateReadmeService.ts

```typescript
import fs from 'fs';
import path from 'path';
import { getLLMRepository } from '../repository/llm';

function findSubdirectories(folderPath: string): string[] {
  return fs.readdirSync(folderPath, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => path.join(folderPath, entry.name));
}


const MAX_LINE_LENGTH = 120; // Maximum characters per line

export async function generateReadmeService({
  folderPath,
  model,
  apiKey,
  apiUrl,
  recursive = false,
  language = 'en',
}: {
  folderPath: string;
  model: string;
  apiKey: string;
  apiUrl?: string;
  recursive?: boolean;
  language?: string;
}) {
  if (!fs.existsSync(folderPath)) {
    console.error(`Directory not found: ${folderPath}`);
    return;
  }
  // 1. Generate README for this folder only
  const files = fs.readdirSync(folderPath).filter(f => fs.statSync(path.join(folderPath, f)).isFile());
  const fileSummaries = files
    // Exclude readme.md
    .filter(file => file.toLowerCase() !== 'readme.md')
    // Convert file name to relative path
    .map(file => {
      const rel = path.relative(folderPath, path.join(folderPath, file));
      const content = fs.readFileSync(path.join(folderPath, file), 'utf-8');

      // Limit the number of characters per line
      const lines = content.split('\n').map(line => {
        if (line.length > MAX_LINE_LENGTH) {
          const truncatedLine = line.substring(0, MAX_LINE_LENGTH - 3) + '...';
          return truncatedLine; // Returns the abbreviated line
        }
        return line;
      });

      return `## ${rel}\n\`\`\`\n${lines.join('\n')}\n\`\`\``;
    })
    .join('\n\n');
  // Read existing README.md if present
  let existingReadme = '';
  const readmePath = path.join(folderPath, 'README.md');
  if (fs.existsSync(readmePath)) {
    existingReadme = fs.readFileSync(readmePath, 'utf-8');
  }
  const prompt = `Based on the contents of the files in the following folder, update the README.md so that it describes the purpose, rules, and roles of the files in this folder.
If a README.md already exists, use its content as a base and update it to reflect the current state of the folder. Return valid markdown. Include file contents as needed to provide context.
\n${fileSummaries}\n\n Existing README.md content:\n${existingReadme}`;
  const llm = await getLLMRepository({ model, apiKey, apiUrl });
  const content = await llm.call(prompt);
  const outputPath = path.join(folderPath, 'README.md');
  if (content) {
    fs.writeFileSync(outputPath, content);
    console.log(`✅ README.md generated: ${outputPath}`);
  } else {
    console.error('❌ Failed to generate README.md');
  }
  // 2. If recursive is true, apply the same process recursively to subdirectories
  if (recursive) {
    const subdirs = findSubdirectories(folderPath);
    for (const subdir of subdirs) {
      await generateReadmeService({
        folderPath: subdir,
        model,
        apiKey,
        apiUrl,
        recursive: true,
        language,
      });
    }
  }
}

```
