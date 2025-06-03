# src/

## Overview

- **Folder name:** src
- **Purpose:** This folder contains the source code for a command-line tool that automates the generation of `README.md` files and Copilot configuration files. It leverages libraries like `commander` for command-line argument parsing and integrates with Large Language Models (LLMs) such as OpenAI and Gemini to generate content based on the contents of files within a directory.  The code is designed with modularity in mind, allowing for easy extension and support for different LLM providers.

## Naming Conventions

- Files are named using PascalCase (e.g., `GenerateReadmeService.ts`).
- Functions are named using camelCase (e.g., `generateReadmeService`).
- Variables are named using camelCase.
- Interfaces are prefixed with `I` (e.g., `IGenerateReadmeOptions`).

## Design Policy

- The code follows a modular design, separating concerns into different services and repositories.
- `index.ts` serves as the entry point, handling command-line argument parsing and orchestration.
- Services encapsulate the core logic for generating READMEs and Copilot files.
- Repositories handle interactions with external services like LLMs.
- Interfaces define contracts for data structures and function signatures.

## Technologies and Libraries Used

- TypeScript: Primary programming language.
- Commander: Command-line argument parsing.
- OpenAI/Gemini SDKs (Hypothetical): Libraries for interacting with OpenAI or Gemini APIs (implementation detail dependent on LLM chosen).
- Node.js: Runtime environment.
- Axios or similar (Hypothetical): For making HTTP requests to LLM APIs.
- File system APIs (fs): For reading and writing files.

## File Roles

| File Name                    | Role                               | Logic and Functions                                                                                                                                                                     | Names of other files used           |
| ---------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `index.ts`                   | Entry point and command handling   | - Initializes the Commander program.  - Defines command-line options for `readme` and `copilot` commands.  - Invokes the appropriate service based on the chosen command. | `GenerateReadmeService.ts`, `generateCopilotInstructionsService.ts` |
| `GenerateReadmeService.ts`   | Generates the `README.md` file   | - Accepts folder path and options.  - Reads file contents from the specified directory.  - Sends file contents to an LLM to generate README content.  - Writes the generated content to `README.md`. |  LLM repository (hypothetical)     |
| `generateCopilotInstructionsService.ts` | Generates Copilot configuration | - Collects README.md and any existing configuration files. - Sends to the LLM to summarize as Copilot configuration file format. - Writes to copilot.json or similar.                 | LLM repository (hypothetical)      |

## Code Style and Examples

- **Asynchronous Operations:** Use `async/await` for handling asynchronous operations like file I/O and API calls.

  ```typescript
  async function generateReadme(folderPath: string): Promise<void> {
    // ...
    const fileContents = await fs.promises.readFile(filePath, 'utf-8');
    // ...
  }
  ```

- **Error Handling:** Implement robust error handling using `try/catch` blocks.

  ```typescript
  try {
    const readmeContent = await llmService.generateReadme(fileContents);
    await fs.promises.writeFile('README.md', readmeContent);
  } catch (error) {
    console.error('Error generating README:', error);
  }
  ```

- **Promises:** All file operations should use the promise-based APIs of the `fs` module (`fs.promises`).

## File Templates and Explanations

- No specific file templates are defined.  The structure is determined by the logic within each service.

## Coding Rules

- **Use TypeScript features:** Utilize features like interfaces, classes, and generics to create maintainable and type-safe code.
- **Keep functions small and focused:** Each function should have a single responsibility.
- **Write clear and concise comments:** Document the purpose of functions and complex logic.
- **Handle errors gracefully:**  Implement proper error handling and logging.
- **Follow the naming conventions:** Maintain consistency in naming conventions.

## Notes for Developers

- When implementing the LLM integration, consider using an abstraction layer (e.g., a repository) to decouple the services from specific LLM providers.  This will make it easier to switch between OpenAI, Gemini, or other LLMs in the future.
- Implement thorough logging for debugging and monitoring purposes.
- Add unit tests to ensure the correctness of the code.
- Consider adding support for customizing the LLM prompts used for generating READMEs and Copilot files.
- Make the tool configurable using environment variables or a configuration file.
