import { Command } from 'commander';
import { generateReadmeService } from './service/GenerateReadmeService';
import { generateCopilotInstructionsService } from './service/generateCopilotInstructionsService';

const program = new Command();

program
  .command('readme')
  .description('Generate a README file based on folder contents')
  .option('-d, --directory <path>', 'Target directory', process.cwd())
  .option('-m, --model <model>', 'LLM model (gpt-4o/gemini-2.0-flash)')
  .option('--api-key <key>', 'API key')
  .option('--api-url <url>', 'API URL')
  .option('-r, --recursive', 'Recursively search files in subdirectories', false)
  .option('--env-mode', 'Load API key and URL from environment variables')
  .action(async (opts) => {
    let apiKey = opts.apiKey;
    let apiUrl = opts.apiUrl;

    if (opts.envMode) {
      apiKey = process.env.LLM_API_KEY;
      apiUrl = process.env.LLM_API_URL;

      if (!apiKey || !apiUrl) {
        throw new Error('LLM_API_KEY and LLM_API_URL environment variables must be set when using --env-mode');
      }
    }

    await generateReadmeService({
      folderPath: opts.directory,
      model: opts.model,
      apiKey: apiKey,
      apiUrl: apiUrl,
      recursive: opts.recursive,
    });
  });

program
  .command('copilot')
  .description('Generate a Copilot configuration file by integrating all README.md and existing copilot-instructions.md')
  .option('-d, --directory <path>', 'Target directory', process.cwd())
  .option('-m, --model <model>', 'LLM model (gpt-4o/gemini-2.0-flash)', 'gpt-4o')
  .option('--api-key <key>', 'API key')
  .option('--api-url <url>', 'API URL')
  .option('--env-mode', 'Load API key and URL from environment variables')
  .action(async (opts) => {
    let apiKey = opts.apiKey;
    let apiUrl = opts.apiUrl;

    if (opts.envMode) {
      apiKey = process.env.LLM_API_KEY;
      apiUrl = process.env.LLM_API_URL;

      if (!apiKey || !apiUrl) {
        throw new Error('LLM_API_KEY and LLM_API_URL environment variables must be set when using --env-mode');
      }
    }

    await generateCopilotInstructionsService({
      rootDir: opts.directory,
      model: opts.model,
      apiKey: apiKey,
      apiUrl: apiUrl,
    });
  });

program.parse();
