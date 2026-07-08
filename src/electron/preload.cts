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
  actions: {
    executeAction: (action: unknown, conversationId?: number) =>
      electron.ipcRenderer.invoke('actions:execute', action, conversationId),
  },
  memory: {
    getMemories: () => electron.ipcRenderer.invoke('memory:list'),
    createMemory: (content: string) => electron.ipcRenderer.invoke('memory:create', content),
    deleteMemory: (id: number) => electron.ipcRenderer.invoke('memory:delete', id),
    clearMemories: () => electron.ipcRenderer.invoke('memory:clear'),
  },
  notes: {
    list: () => electron.ipcRenderer.invoke('notes:list'),
  },
  files: {
    summarizeTextFile: (fileContent: string) =>
      electron.ipcRenderer.invoke('files:summarizeTextFile', fileContent),
  },
});
