import type { IpcMain } from 'electron';
import { getMemories } from '../models/memoryModel.js';

export function registerMemoryController(ipcMain: IpcMain) {
  ipcMain.handle('memory:list', () => getMemories());
}
