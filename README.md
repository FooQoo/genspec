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
- `readme`: Generate a README file based on folder contents
- `copilot`: Generate a Copilot configuration file by integrating all README.md and existing copilot-instructions files

# Options
- `-d, --directory <path>`: Target directory (default: current working directory)
- `-m, --model <model>`: LLM model (`gpt-4o` or `gemini-2.0-flash`)
- `--llm-api-key <key>`: API key
- `--llm-api-url <url>`: API URL
- `-r, --recursive`: Recursively search files in subdirectories (default: false)
- `-l, --language <language>`: Language for the output (`ja`/`en`/`ko`/`zh`, default: `en`)
- `--env-mode`: Load API key and URL from environment variables
