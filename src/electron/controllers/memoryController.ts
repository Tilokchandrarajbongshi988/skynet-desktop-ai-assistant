import type { IpcMain } from 'electron';
import {
  clearMemories,
  createMemory,
  deleteMemory,
  getMemories,
} from '../models/memoryModel.js';

export function registerMemoryController(ipcMain: IpcMain) {
  ipcMain.handle('memory:list', () => getMemories());
  ipcMain.handle('memory:create', (_event, content: string) => createMemory(content));
  ipcMain.handle('memory:delete', (_event, id: number) => deleteMemory(id));
  ipcMain.handle('memory:clear', () => clearMemories());
}
