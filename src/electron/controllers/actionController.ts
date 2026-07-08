import type { IpcMain, IpcMainInvokeEvent } from 'electron';
import { createRequire } from 'node:module';
import { createActivity } from '../models/activityModel.js';
import { saveMessage } from '../models/chatModel.js';
import type { SkynetAction } from '../services/actionRouterService.js';
import { openApprovedApp } from '../services/appLauncherService.js';
import { searchFileNames } from '../services/fileService.js';
import { openFolder } from '../services/folderService.js';
import { createNoteFile } from '../services/noteService.js';

const require = createRequire(import.meta.url);
const electron = require('electron');
const { dialog, BrowserWindow } = electron;

type ActionResult = {
  success: boolean;
  message: string;
};

export function registerActionController(ipcMain: IpcMain) {
  ipcMain.handle('actions:execute', (event, action: SkynetAction, conversationId?: number) =>
    executeAction(event, action, conversationId),
  );
}

async function executeAction(
  event: IpcMainInvokeEvent,
  action: SkynetAction,
  conversationId?: number,
): Promise<ActionResult> {
  try {
    const result = await runAction(event, action);

    if (conversationId) {
      saveMessage(conversationId, 'assistant', result.message);
    }

    return result;
  } catch {
    createActivity(action?.type ?? 'UNKNOWN_ACTION', 'Action failed', 'failed');

    return {
      success: false,
      message: 'Something went wrong while performing the action.',
    };
  }
}

async function runAction(event: IpcMainInvokeEvent, action: SkynetAction): Promise<ActionResult> {
  if (action.type === 'OPEN_FOLDER') {
    const result = await openFolder(action.folderName);
    createActivity(
      'OPEN_FOLDER',
      result.success ? `Opened ${action.folderName} folder` : `Failed to open ${action.folderName} folder`,
      result.success ? 'success' : 'failed',
    );

    return result;
  }

  if (action.type === 'CREATE_NOTE') {
    const result = createNoteFile(action.payload);
    return { success: true, message: result.message };
  }

  if (action.type === 'OPEN_APP') {
    const result = openApprovedApp(action.payload.appName);
    return { success: true, message: result.message };
  }

  if (action.type === 'SEARCH_FILES') {
    const folder = await chooseFolder(event, 'Choose a folder to search');

    if (!folder) {
      return { success: false, message: 'Action cancelled.' };
    }

    const results = searchFileNames(folder, action.payload.query);
    const message =
      results.length > 0
        ? `Found ${results.length} matching file(s): ${results.map((file) => file.name).join(', ')}`
        : `No files matched "${action.payload.query}" in the selected folder.`;

    return { success: true, message };
  }

  return {
    success: false,
    message: 'This action is not supported yet.',
  };
}

async function chooseFolder(event: IpcMainInvokeEvent, title: string) {
  const window = BrowserWindow.fromWebContents(event.sender);
  const dialogOptions = {
    title,
    properties: ['openDirectory'],
  } as const;
  const folder = window
    ? await dialog.showOpenDialog(window, dialogOptions)
    : await dialog.showOpenDialog(dialogOptions);

  if (folder.canceled || !folder.filePaths[0]) {
    return null;
  }

  return folder.filePaths[0];
}
