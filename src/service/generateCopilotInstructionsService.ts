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
  output = '.github/copilot-instructions.md',
}: {
  rootDir: string;
  model: string;
  apiKey: string;
  apiUrl?: string;
  output?: string;
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

  // 3. Read existing copilot-instructions.md if exists (in .github under cwd)
  let existingCopilotInstructions = '';
  if (fs.existsSync(outputPath)) {
    existingCopilotInstructions = fs.readFileSync(outputPath, 'utf-8');
  }

  // 4. Generate copilot-instructions.md using LLM
  const prompt = `You are to create a single copilot-instructions.md file for the entire project, based on the following README files from each folder and the existing copilot-instructions.md if present.\nIntegrate the rules, coding conventions, and important notes from all folders and the existing copilot-instructions.md.\nOutput only raw markdown content. Do NOT wrap with code block.\n\n${existingCopilotInstructions ? '## Existing copilot-instructions.md\n' + existingCopilotInstructions + '\n---\n' : ''}${allReadmeContents}`;

  const llm = await getLLMRepository({ model, apiKey, apiUrl });
  const content = await llm.call(prompt);
  // Ensure .github directory exists in cwd
  if (!fs.existsSync(githubDir)) {
    fs.mkdirSync(githubDir);
  }
  if (content) {
    fs.writeFileSync(outputPath, content);
    console.log(`✅ Copilot instructions generated: ${outputPath}`);
  } else {
    console.error('❌ Failed to generate copilot-instructions.md');
  }
}
