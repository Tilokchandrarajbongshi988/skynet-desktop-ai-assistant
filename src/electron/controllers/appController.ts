import type { IpcMain, IpcMainInvokeEvent } from 'electron';
import { createRequire } from 'node:module';
import { saveMessage } from '../models/chatModel.js';
import { openApprovedApp } from '../services/appLauncherService.js';
import type { LunaAction } from '../services/actionRouterService.js';
import { createNoteFile } from '../services/noteService.js';
import { searchFileNames } from '../services/fileService.js';

const require = createRequire(import.meta.url);
const electron = require('electron');
const { dialog, BrowserWindow } = electron;

export function registerAppController(ipcMain: IpcMain) {
  ipcMain.handle('apps:status', () => ({ status: 'enabled' }));
  ipcMain.handle('actions:execute', (event, action: LunaAction, conversationId?: number) =>
    executeAction(event, action, conversationId),
  );
}

async function executeAction(
  event: IpcMainInvokeEvent,
  action: LunaAction,
  conversationId?: number,
) {
  let resultMessage = 'Action completed.';

  if (action.type === 'CREATE_NOTE') {
    const result = createNoteFile(action.payload);
    resultMessage = result.message;
  }

  if (action.type === 'OPEN_APP') {
    const result = openApprovedApp(action.payload.appName);
    resultMessage = result.message;
  }

  if (action.type === 'SEARCH_FILES') {
    const window = BrowserWindow.fromWebContents(event.sender);
    const dialogOptions = {
      title: 'Choose a folder to search',
      properties: ['openDirectory'],
    } as const;
    const folder = window
      ? await dialog.showOpenDialog(window, dialogOptions)
      : await dialog.showOpenDialog(dialogOptions);

    if (folder.canceled || !folder.filePaths[0]) {
      resultMessage = 'Action cancelled.';
    } else {
      const results = searchFileNames(folder.filePaths[0], action.payload.query);
      resultMessage =
        results.length > 0
          ? `Found ${results.length} matching file(s): ${results.map((file) => file.name).join(', ')}`
          : `No files matched "${action.payload.query}" in the selected folder.`;
    }
  }

  if (conversationId) {
    saveMessage(conversationId, 'assistant', resultMessage);
  }

  return { message: resultMessage };
}
