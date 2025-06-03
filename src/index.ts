import { Command } from 'commander';
import { generateReadmeService } from './service/GenerateReadmeService';
import { generateCopilotInstructionsService } from './service/generateCopilotInstructionsService';

const program = new Command();

program
  .command('readme')
  .description('Generate a README file based on folder contents')
  .option('-d, --directory <path>', 'Target directory', process.cwd())
  .option('-m, --model <model>', 'LLM model (gpt-4o/gemini-2.0-flash)', 'gpt-4o')
  .option('--api-key <key>', 'API key')
  .option('--api-url <url>', 'API URL')
  .option('-r, --recursive', 'Recursively search files in subdirectories', false)
  .action(async (opts) => {
    await generateReadmeService({
      folderPath: opts.directory,
      model: opts.model,
      apiKey: opts.apiKey,
      apiUrl: opts.apiUrl,
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
  .action(async (opts) => {
    await generateCopilotInstructionsService({
      rootDir: opts.directory,
      model: opts.model,
      apiKey: opts.apiKey,
      apiUrl: opts.apiUrl,
    });
  });

program.parse();
