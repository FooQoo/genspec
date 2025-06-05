import { Command } from 'commander';
import { generateReadmeService } from "./service/generateReadmeService";
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
  .description('Generate a Copilot configuration file by integrating all README.md and existing copilot-instructions.md')
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
