const electron = require('electron');

import type { IpcRendererEvent } from 'electron';

type Statistics = {
  cpuUsage: number;
  ramUsage: number;
  storageData: number;
};

electron.contextBridge.exposeInMainWorld("luna", {
  subscribeStatistics: (callback: (statistics: Statistics) => void) =>  {
    electron.ipcRenderer.on("statistics", (_: IpcRendererEvent, stats: Statistics) => {
      callback(stats);
    })
  },
  getStaticData: () => electron.ipcRenderer.invoke('getStaticData'),
  settings: {
    getSettings: () => electron.ipcRenderer.invoke('settings:get'),
    saveSetup: (data: unknown) => electron.ipcRenderer.invoke('settings:saveSetup', data),
  },
  chat: {
    getMessages: () => electron.ipcRenderer.invoke('chat:getMessages'),
    sendMessage: (message: { conversationId?: number; content: string }) =>
      electron.ipcRenderer.invoke('chat:sendMessage', message),
  },
  memories: {
    list: () => electron.ipcRenderer.invoke('memory:list'),
  },
  notes: {
    list: () => electron.ipcRenderer.invoke('notes:list'),
  },
});
