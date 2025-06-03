import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';

const getOpenAIClient = (apiKey?: string, apiUrl?: string) => {
  return new OpenAI({
    apiKey: apiKey || process.env.OPENAI_API_KEY,
    baseURL: apiUrl || process.env.OPENAI_API_URL || 'https://api.openai.com/v1',
  });
};

export async function generateReadme({
  folderPath,
  model = 'gpt-4o',
  apiKey,
  apiUrl,
}: {
  folderPath: string;
  model?: string;
  apiKey?: string;
  apiUrl?: string;
}) {
  if (!fs.existsSync(folderPath)) {
    console.error(`フォルダが見つかりません: ${folderPath}`);
    return;
  }

  const files = fs.readdirSync(folderPath).filter(f => fs.statSync(path.join(folderPath, f)).isFile());

  const fileSummaries = files
    .map(file => {
      const fullPath = path.join(folderPath, file);
      const content = fs.readFileSync(fullPath, 'utf-8').slice(0, 1000);
      return `## ${file}\n\u0060\u0060\u0060\n${content}\n\u0060\u0060\u0060`;
    })
    .join('\n\n');

  const prompt = `\n以下のフォルダに含まれるファイルの内容を元に、このフォルダの目的やルール、ファイルの役割を記載したREADME.mdを作成してください。\n記載内容は以下を含めてください：\nフォルダパス: ${folderPath}\n- フォルダの概要（自然文）\n  - フォルダ名：パスは含めない\n  - フォルダの目的\n- 命名規則\n- 設計方針\n- 利用技術とライブラリ\n- 各ファイルの役割の簡潔な解説\n  - 表形式で表示\n    - ファイル名\n    - 役割\n    - ロジックや機能\n      - どのようなロジックや機能を実装しているか関数ごとに記載\n    - 利用している別のファイル名\n      - 依存関係を示す\n- コードスタイルとその例\n  - 細かいロジックごとの実装方法とそのコード例をパターンごとに解説\n- ファイルテンプレートとその解説\n- 上記を踏まえたコーディングルール\n- 開発者向けの補足\n${fileSummaries}\n`;

  const openai = getOpenAIClient(apiKey, apiUrl);
  const res = await openai.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = res.choices[0].message.content;
  const outputPath = path.join(folderPath, 'README.md');

  if (content) {
    fs.writeFileSync(outputPath, content);
    console.log(`✅ README.md を生成しました: ${outputPath}`);
  } else {
    console.error('❌ README.md の生成に失敗しました');
  }
}

export async function generateCopilot({
  folderPath,
  model = 'gpt-4o',
  apiKey,
  apiUrl,
}: {
  folderPath: string;
  model?: string;
  apiKey?: string;
  apiUrl?: string;
}) {
  if (!fs.existsSync(folderPath)) {
    console.error(`フォルダが見つかりません: ${folderPath}`);
    return;
  }

  const files = fs.readdirSync(folderPath).filter(f => fs.statSync(path.join(folderPath, f)).isFile());

  const fileSummaries = files
    .map(file => {
      const fullPath = path.join(folderPath, file);
      const content = fs.readFileSync(fullPath, 'utf-8').slice(0, 1000);
      return `## ${file}\n\u0060\u0060\u0060\n${content}\n\u0060\u0060\u0060`;
    })
    .join('\n\n');

  const prompt = `\n以下のフォルダに含まれるファイルの内容を元に、このフォルダの開発ルールやコーディング規約、Copilotに守らせたい指示をまとめたcopilot-instructions.mdを作成してください。\n記載内容は以下を含めてください：\nフォルダパス: ${folderPath}\n- フォルダの目的\n- 命名規則\n- 設計方針\n- 利用技術とライブラリ\n- 各ファイルの役割\n- コーディングルール\n- Copilotに守らせたい具体的な指示\n- 開発者向けの補足\n${fileSummaries}\n`;

  const openai = getOpenAIClient(apiKey, apiUrl);
  const res = await openai.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = res.choices[0].message.content;
  const outputPath = path.join(folderPath, 'copilot-instructions.md');

  if (content) {
    fs.writeFileSync(outputPath, content);
    console.log(`✅ copilot-instructions.md を生成しました: ${outputPath}`);
  } else {
    console.error('❌ copilot-instructions.md の生成に失敗しました');
  }
}
