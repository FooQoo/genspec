# src/service/ README.md

## Overview

**Folder Name:** service

**Purpose:** The `service` folder encapsulates the application's business logic. It acts as a layer between the API endpoints (controllers) and the data access layer (repositories). Services are responsible for orchestrating data retrieval, manipulation, and validation before passing data to the presentation layer or storing it in the database. This separation of concerns promotes maintainability, testability, and reusability of the core application logic.

## Naming Conventions

*   Service files should use camelCase for function names (e.g., `generateReadmeService`).
*   Service files should end with the suffix `Service` (e.g., `generateReadmeService.ts`).
*   Related functions should be grouped within the same service file.

## Design Policy

*   Services should be thin and focused on orchestration, delegating complex operations to other modules like repositories or utility functions.
*   Services should not directly access data sources; this is the responsibility of repositories.
*   Services should handle input validation and error handling.
*   Services should be designed to be easily testable, ideally through dependency injection.

## Technologies and Libraries Used

*   **fs (Node.js):** Used for file system operations (reading directories, reading/writing files, checking file existence).
*   **path (Node.js):** Used for constructing and manipulating file paths.
*   **`../repository/llm`:** A custom repository module for interacting with a Large Language Model (LLM).  This likely handles API calls to the LLM.

## File Roles and Responsibilities

| File Name                                     | Role                                                                                 | Logic and Functions                                                                                                                                                                                                                                                      | Names of other files used |
| --------------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `generateCopilotInstructionsService.ts`       | Generates instructions for GitHub Copilot based on existing README files recursively. | `findAllReadmesRecursively`: Recursively searches a directory and its subdirectories for `README.md` files. <br/> `generateCopilotInstructionsService`: Orchestrates the process of finding READMEs and potentially generating instructions based on them, then writes the instructions to a file (default `.github/copilot-instructions.md`).  It resolves `.github` relative to the current working directory. | `../repository/llm`      |
| `generateReadmeService.ts`                    | Generates a README file for a specified directory, optionally recursively.        | `findSubdirectories`: Finds all subdirectories within a given folder. <br/> `generateReadmeService`: Orchestrates the README generation process for a given folder, potentially calling the LLM repository. It also can work recursively for all subfolders. It reads the content of files in the folder and prepares them for the LLM. | `../repository/llm`      |

## Code Style and Examples

*   **Asynchronous Operations:** Services use `async/await` for handling asynchronous operations, such as reading files or calling the LLM repository.

    ```typescript
    export async function generateReadmeService({ folderPath, model, apiKey, apiUrl }: { folderPath: string; model: string; apiKey: string; apiUrl?: string; }) {
      // ... asynchronous operations using await ...
    }
    ```

*   **Error Handling:** Services should implement basic error handling (e.g., checking if a directory exists) and potentially throw exceptions or return error codes as needed.

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

## File Templates and Explanations

A typical service file structure:

```typescript
import { getLLMRepository } from '../repository/llm'; // Example Dependency
import fs from 'fs';
import path from 'path';

// Helper Functions (Optional)
function helperFunction(): void {
  // ...
}

export async function serviceFunction({ /* Input parameters */ }: { /* Parameter Types */ }): Promise<void> {
  try {
    // 1. Input validation
    // ...

    // 2. Data retrieval and processing (using repositories or other services)
    const llm = getLLMRepository();
    // ...

    // 3. Business logic
    // ...

    // 4. Return the result
    return ;
  } catch (error) {
    console.error("Error in serviceFunction:", error);
    throw error; // Or return an error code/message
  }
}
```

## Coding Rules

*   **Single Responsibility Principle:** Each service function should have a clear and focused purpose.
*   **Dependency Injection:**  Use dependency injection to inject dependencies (e.g., repositories) into services to improve testability and maintainability.
*   **Error Handling:**  Implement robust error handling to gracefully handle potential errors.
*   **Logging:**  Use a logging mechanism to log important events and errors for debugging purposes.
*   **Asynchronous Operations:** Handle asynchronous operations properly using `async/await`.
*   **Immutability:** Favor immutability where possible to prevent unexpected side effects.
*   **Code Comments:**  Add clear and concise comments to explain complex logic and important decisions.
*   **Unit Tests:** Write comprehensive unit tests to ensure the correctness of service functions.

## Notes for Developers

*   When modifying existing services, ensure that you do not introduce breaking changes without proper consideration.
*   Always update the unit tests when making changes to service functions.
*   When adding new dependencies, ensure that they are properly documented and that they do not introduce any security vulnerabilities.
*   Consider using a code formatter (e.g., Prettier) and a linter (e.g., ESLint) to enforce code style consistency.
