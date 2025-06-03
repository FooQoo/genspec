import fs from 'fs';
import path from 'path';
import { getLLMRepository } from '../repository/llm';

function findSubdirectories(folderPath: string): string[] {
  return fs.readdirSync(folderPath, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => path.join(folderPath, entry.name));
}

export async function generateReadmeService({
  folderPath,
  model,
  apiKey,
  apiUrl,
  recursive = false,
}: {
  folderPath: string;
  model: string;
  apiKey: string;
  apiUrl?: string;
  recursive?: boolean;
}) {
  if (!fs.existsSync(folderPath)) {
    console.error(`Directory not found: ${folderPath}`);
    return;
  }
  // 1. Generate README for this folder only
  const files = fs.readdirSync(folderPath).filter(f => fs.statSync(path.join(folderPath, f)).isFile());
  const fileSummaries = files
    .map(file => {
      const rel = path.relative(folderPath, path.join(folderPath, file));
      const content = fs.readFileSync(path.join(folderPath, file), 'utf-8').slice(0, 1000);
      return `## ${rel}\n\u0060\u0060\u0060\n${content}\n\u0060\u0060\u0060`;
    })
    .join('\n\n');
  // Read existing README.md if present
  let existingReadme = '';
  const readmePath = path.join(folderPath, 'README.md');
  if (fs.existsSync(readmePath)) {
    existingReadme = fs.readFileSync(readmePath, 'utf-8');
  }
  const prompt = `\nBased on the contents of the files in the following folder, update the README.md so that it describes the purpose, rules, and roles of the files in this folder.\nIf a README.md already exists, use its content as a base and update it to reflect the current state of the folder.\nOutput only raw markdown content. Do NOT wrap with \"\"\"markdown or any code block.\nInclude the following:\nFolder path: ${folderPath}\n- Overview of the folder (natural language)\n  - Folder name (do not include path)\n  - Purpose of the folder\n- Naming conventions\n- Design policy\n- Technologies and libraries used\n- Concise explanation of the role of each file\n  - Display in table format\n    - File name\n    - Role\n    - Logic and functions\n      - Describe what logic or functions are implemented for each function\n    - Names of other files used\n      - Show dependencies\n- Code style and examples\n  - Explain implementation methods and code examples for each pattern\n- File templates and explanations\n- Coding rules based on the above\n- Notes for developers\n${existingReadme ? '\n---\n# Existing README.md\n' + existingReadme : ''}\n${fileSummaries}\n`;
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
      });
    }
  }
}
