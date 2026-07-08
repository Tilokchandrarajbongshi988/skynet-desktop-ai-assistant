import type { IpcMain } from 'electron';
import { getSettings, saveSetup, type SetupInput } from '../models/settingsModel.js';

export function registerSettingsController(ipcMain: IpcMain) {
  ipcMain.handle('settings:get', () => getSettings());
  ipcMain.handle('settings:saveSetup', (_event, data: SetupInput) => saveSetup(data));
}
