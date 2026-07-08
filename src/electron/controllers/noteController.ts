import type { IpcMain } from 'electron';
import { getNotes } from '../models/noteModel.js';

export function registerNoteController(ipcMain: IpcMain) {
  ipcMain.handle('notes:list', () => getNotes());
}
