const electron = require('electron');

import type { IpcRendererEvent } from 'electron';

type Statistics = {
  cpuUsage: number;
  ramUsage: number;
  storageData: number;
};

electron.contextBridge.exposeInMainWorld("electron", {
  subscribeStatistics: (callback: (statistics: Statistics) => void) =>  {
    electron.ipcRenderer.on("statistics", (_: IpcRendererEvent, stats: Statistics) => {
      callback(stats);
    })
  },
  getStaticData: () => electron.ipcRenderer.invoke('getStaticData'),
});
