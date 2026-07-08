import path from "path";
import { createRequire } from 'node:module';
import {isDev} from './utils.js';
import { pollResources, getStaticData } from './resourceManager.js';
import { getPreloadPath } from './pathResolver.js';
import { getDatabasePath, initializeDatabase } from './models/db.js';
import { registerChatController } from './controllers/chatController.js';
import { registerSettingsController } from './controllers/settingsController.js';
import { registerMemoryController } from './controllers/memoryController.js';
import { registerNoteController } from './controllers/noteController.js';
import { registerAppController } from './controllers/appController.js';
import { registerFileController } from './controllers/fileController.js';
import { registerActionController } from './controllers/actionController.js';

const require = createRequire(import.meta.url);
const { app, BrowserWindow, ipcMain } = require('electron');

app.whenReady().then(async () => {
  await initializeDatabase();
  console.log(`Skynet database: ${getDatabasePath()}`);
  registerSettingsController(ipcMain);
  registerChatController(ipcMain);
  registerMemoryController(ipcMain);
  registerNoteController(ipcMain);
  registerAppController(ipcMain);
  registerActionController(ipcMain);
  registerFileController(ipcMain);

  const mainWindow = new BrowserWindow({
    width: 1180,
    height: 760,
    minWidth: 920,
    minHeight: 640,
    title: 'Skynet',
    webPreferences: {
      preload: getPreloadPath()
    },
  });
  if (isDev()) {
    mainWindow.loadURL('http://localhost:5123');
  }else {
    mainWindow.loadFile(path.join(app.getAppPath(), 'dist-react', 'index.html'));
  }

  pollResources(mainWindow);

  ipcMain.handle('getStaticData', () => {
    return getStaticData();
  });

  // Future controllers for Ollama and advanced actions will be registered here.
});
 
