import type { IpcMain } from 'electron';
import { createActivity } from '../models/activityModel.js';
import { getSettings } from '../models/settingsModel.js';
import { chatWithPrompt } from '../services/ollamaService.js';

export function registerFileController(ipcMain: IpcMain) {
  ipcMain.handle('files:status', () => ({ status: 'enabled' }));
  ipcMain.handle('files:summarizeTextFile', (_event, fileContent: string) =>
    summarizeTextFile(fileContent),
  );
}

async function summarizeTextFile(fileContent: string) {
  const trimmedContent = fileContent.trim();

  if (!trimmedContent) {
    return { summary: 'The uploaded file is empty.' };
  }

  const settings = getSettings();
  const prompt = `Summarize this document in simple points:
- Main idea
- Important details
- Action items if any

Document:
${trimmedContent}`;

  const summary = await chatWithPrompt({
    modelName: settings.modelName,
    prompt,
  });

  const status = summary.startsWith('Ollama is not running') ? 'failed' : 'success';
  createActivity('file_summarized', 'Summarized an uploaded text file.', status);
  return { summary };
}
