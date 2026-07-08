import type { IpcMain } from 'electron';
import { getMessages, sendFakeMessage } from '../models/chatModel.js';

export function registerChatController(ipcMain: IpcMain) {
  ipcMain.handle('chat:getMessages', () => getMessages());
  ipcMain.handle('chat:sendFakeMessage', (_event, message: string) => sendFakeMessage(message));
}
