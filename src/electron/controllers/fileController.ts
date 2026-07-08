import type { IpcMain } from 'electron';

export function registerFileController(ipcMain: IpcMain) {
  ipcMain.handle('files:status', () => ({ status: 'disabled' }));
}
