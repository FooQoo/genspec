import { Command } from 'commander';
import { generateReadmeService } from './service/GenerateReadmeService';

const program = new Command();

program
  .command('readme')
  .description('Generate a README file based on folder contents')
  .option('-d, --directory <path>', 'Target directory', process.cwd())
  .option('-m, --model <model>', 'LLM model (gpt-4o/gemini-2.0-flash)', 'gpt-4o')
  .option('--api-key <key>', 'API key')
  .option('--api-url <url>', 'API URL')
  .action(async (opts) => {
    await generateReadmeService({
      folderPath: opts.directory,
      model: opts.model,
      apiKey: opts.apiKey,
      apiUrl: opts.apiUrl,
    });
  });

program.parse();
