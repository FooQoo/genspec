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
