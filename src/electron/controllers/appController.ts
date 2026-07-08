import type { IpcMain } from 'electron';

export function registerAppController(ipcMain: IpcMain) {
  ipcMain.handle('apps:status', () => ({ status: 'enabled' }));
}
