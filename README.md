# Skynet

Skynet is a privacy-first local AI desktop assistant for Windows. It is built with Electron, React, TypeScript, Tailwind CSS, SQLite, and Ollama.

Skynet runs as a desktop app, stores data locally, and talks to a local Ollama model on your computer. It does not use a cloud AI API.

## What Skynet Can Do

- Chat with a local AI model using Ollama
- Save chat history locally in SQLite
- Remember user-provided facts when messages start with `remember`
- Summarize uploaded `.txt` files
- Ask permission before safe desktop actions
- Open approved folders only: Downloads, Desktop, and Documents
- Show a privacy dashboard for local-first behavior

## Tech Stack

- Electron
- React
- TypeScript
- Tailwind CSS
- SQLite through `sql.js`
- Ollama
- Model: `qwen2.5:3b-instruct`
- Packaging: `electron-builder`

## Requirements

Install these before running Skynet:

- Node.js
- npm
- Ollama

Download Ollama:

```text
https://ollama.com/download
```

Install the local model:

```powershell
ollama pull qwen2.5:3b-instruct
```

Check that Ollama is running:

```powershell
Invoke-RestMethod http://localhost:11434/api/tags
```

If Ollama is not running, start it:

```powershell
ollama serve
```

## Using The Desktop App

Run the installer from:

```text
release/Skynet-Setup-0.0.0-x64.exe
```

Or run the portable executable:

```text
release/Skynet-Portable-0.0.0-x64.exe
```

After opening Skynet:

1. Complete onboarding.
2. Go to Chat.
3. Ask a normal question, such as:

```text
Explain async await simply
```

Skynet sends the message to Ollama locally at:

```text
http://localhost:11434/api/chat
```

## Useful Chat Commands

Save a memory:

```text
remember my name is Tilok
remember I prefer short answers
```

Summarize a text file:

1. Upload a `.txt` file in Chat.
2. Send:

```text
summarize this file
```

Open a safe folder:

```text
open downloads folder
open desktop
open documents
```

Skynet will ask for permission before opening a folder.

Unsupported/destructive actions are blocked. For example:

```text
delete my downloads
open C drive
```

## Development

Install dependencies:

```powershell
npm install
```

Start the app in development mode:

```powershell
npm run dev
```

This starts the Vite React app and opens the Electron desktop window.

## Build

Build the React and Electron files:

```powershell
npm run build
```

Run lint:

```powershell
npm run lint
```

Create the Windows installer and portable executable:

```powershell
npm run dist
```

Packaged files are created in:

```text
release/
```

## Project Structure

```text
src/ui/
  React views and components

src/electron/controllers/
  IPC controllers for chat, settings, files, actions, and app status

src/electron/models/
  SQLite database setup and data models

src/electron/services/
  Business logic for Ollama, action detection, folders, files, notes, and apps

src/electron/preload.cts
  Safe bridge between React and Electron through window.skynet
```

## Privacy Notes

- Skynet stores app data locally.
- Chat history is saved in a local SQLite database.
- Ollama runs locally on your computer.
- No cloud AI API is used.
- Desktop actions require confirmation.
- Skynet only opens approved folders and does not delete, rename, or move files.

## Troubleshooting

If chat does not reply, check Ollama:

```powershell
ollama list
Invoke-RestMethod http://localhost:11434/api/tags
```

If the model is missing:

```powershell
ollama pull qwen2.5:3b-instruct
```

If packaging fails because files are locked, close Skynet, close File Explorer windows opened inside `release/`, then run:

```powershell
npm run dist
```
