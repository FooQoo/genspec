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
*   Services should not directly access request or response objects from the HTTP layer.
*   Services should handle error cases gracefully and return meaningful error messages or throw exceptions.
*   Services should be designed to be easily testable, ideally with unit tests.

## Technologies and Libraries Used

*   TypeScript
*   fs (Node.js file system module)
*   path (Node.js path module)

## File Roles

| File Name               | Role                                                                 | Logic and Functions                                                                                                                                                             | Names of other files used |
| ----------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| generateReadmeService.ts | Generates a README.md file based on the contents of a specified folder. | `generateReadmeService`: Reads files from a directory, extracts the first 1000 characters of each file, and constructs a prompt for an LLM to generate a README.md content. | `../repository/llm`       |

## Code Style and Examples

*   **Asynchronous Operations:**  Use `async/await` for handling asynchronous operations. Example:

    ```typescript
    async function generateReadmeService(options: {folderPath:string,model:string, apiKey:string, apiUrl?:string}) {
        // ... asynchronous operations using await ...
    }
    ```

*   **Error Handling:** Implement try-catch blocks to catch potential errors and handle them gracefully.

    ```typescript
    try {
        const files = fs.readdirSync(folderPath);
        // ...
    } catch (error) {
        console.error("Error reading directory:", error);
        return;
    }
    ```

*   **Import Statements:** Use absolute imports for modules within the project.

    ```typescript
    import { getLLMRepository } from '../repository/llm';
    ```

## File Templates and Explanations

All service files should follow the following structure:

```typescript
// Import necessary modules
import fs from 'fs';
import path from 'path';
import { /* dependencies */ } from '../repository/llm';

// Define the service function
export async function exampleService(params: { /* parameters */ }) {
  try {
    // Implement the service logic
    // Use await for asynchronous operations
    const result = await /* asynchronous operation */;
    return result;
  } catch (error) {
    // Handle errors appropriately
    console.error('An error occurred:', error);
    throw error; // or return an error message
  }
}
```

## Coding Rules

*   Adhere to the Naming Conventions specified above.
*   Implement comprehensive error handling using try-catch blocks.
*   Utilize `async/await` for asynchronous operations to improve code readability.
*   Write clear and concise comments to explain complex logic.
*   Keep service functions focused on orchestration and delegate complex operations.
*   Ensure all services are testable through unit tests.
*   All functions should have descriptive names that clearly indicate their purpose.
*   Avoid deeply nested code blocks to improve readability.
*   Prioritize code clarity and maintainability over premature optimization.
*   Parameters passed to functions should be explicitly typed.

## Notes for Developers

*   When creating new services, consider the existing architecture and try to maintain a consistent style.
*   Before making changes to existing services, ensure you understand their purpose and how they are used by other parts of the application.
*   Document all new services and modifications to existing services thoroughly.
*   Pay special attention to security considerations when handling sensitive data.
*   When in doubt, consult with other developers or refer to the project's coding standards.
