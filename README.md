# Luna

Luna is a privacy-first local AI desktop assistant built with Electron, React, TypeScript, Tailwind CSS, SQLite, and Ollama.

Luna keeps app data local and connects to Ollama on your computer. It does not include Ollama model files inside the app package.

## Requirements

- Node.js
- npm
- Ollama
- The local model `qwen2.5:3b-instruct`

Install Ollama from:

```powershell
https://ollama.com/download
```

Then install the model:

```powershell
ollama pull qwen2.5:3b-instruct
```

Make sure Ollama is running before starting Luna.

## Development

Install dependencies:

```powershell
npm install
```

Run Luna in development mode:

```powershell
npm run dev
```

This starts the Vite React app and the Electron desktop window.

## Production Build

Build the React and Electron files:

```powershell
npm run build
```

## Windows Package

Create the Windows installer and portable executable:

```powershell
npm run dist
```

The packaged files are created in:

```powershell
release/
```

## Before Running The Packaged App

Users must install Ollama separately and run:

```powershell
ollama pull qwen2.5:3b-instruct
```

Luna talks to Ollama locally at:

```powershell
http://localhost:11434/api/chat
```
