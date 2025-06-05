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
  const prompt = `You are to create a single copilot-instructions.md file for the entire project, based only on the following README files from each folder. Please output the copilot-instructions in ${language} language.\nIntegrate the rules, coding conventions, and important notes from all folders.\nOutput only raw markdown content. Do NOT wrap with code block. Do NOT use any code block (such as triple backticks \`\`\` or \`\`\`markdown). Output only pure markdown text, never wrap any part in a code block.\n\n${allReadmeContents}`;

  const successMessage = `✅ Copilot instructions generated: ${outputPath}`;
  const failureMessage = `❌ Failed to generate copilot-instructions.md`;

  const llm = await getLLMRepository({ model, apiKey, apiUrl });
  let instructionContent = await llm.call(prompt);
  // READMEを結合
  const readmeSection = '\n\n---\n\n# All README files\n' + allReadmeContents;
  const finalContent = (instructionContent || '') + readmeSection;
  // Ensure .github directory exists in cwd
  if (!fs.existsSync(githubDir)) {
    fs.mkdirSync(githubDir);
  }
  fs.writeFileSync(outputPath, finalContent);
  if (instructionContent) {
    console.log(successMessage);
  } else {
    console.error(failureMessage);
  }
}
