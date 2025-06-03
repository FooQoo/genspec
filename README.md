# genspec
A simple CLI tool for generating code specifications.
This tool reads the files in a folder and generates a README based on their contents.
It also supports `copilot-instructions.md`, generating a Copilot configuration file based on the contents of each folder.

# Installation
```bash
npm install -g genspec
```

# Usage
```bash
genspec <command> [options]
```

# Commands
- `readme`: Generate a README file.
- `copilot`: Generate a Copilot configuration file.

# Options
- `--directory <path>`: Specify the directory to generate the file in (default: current directory).
- `--recursive`: Recursively generate files in subdirectories. 
- `--model <model>`: Specify the model to use for LLM generation. choose from `gpt-xxx` or `gemini-xxx`.
- `--api-key <key>`: Specify the API key for the LLM service.
- `--api-url <url>`: If you use OpenAI, specify the API URL for the LLM service. (default: https://api.openai.com/v1)
