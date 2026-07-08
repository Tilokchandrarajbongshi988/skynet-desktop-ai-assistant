import os from 'os';
import path from 'path';
import { createRequire } from 'node:module';
import type { FolderName } from './actionRouterService.js';

const require = createRequire(import.meta.url);
const { shell } = require('electron');

type FolderResult = {
  success: boolean;
  message: string;
};

export async function openFolder(folderName: FolderName): Promise<FolderResult> {
  const folderPath = getFolderPath(folderName);

  if (!folderPath) {
    return {
      success: false,
      message: 'I can only open Downloads, Desktop, and Documents for now.',
    };
  }

  const errorMessage = await shell.openPath(folderPath);

  if (errorMessage) {
    return {
      success: false,
      message: `I could not open your ${folderName} folder.`,
    };
  }

  return {
    success: true,
    message: `Opened your ${folderName} folder.`,
  };
}

function getFolderPath(folderName: FolderName) {
  const homeDir = os.homedir();

  if (folderName === 'downloads') {
    return path.join(homeDir, 'Downloads');
  }

  if (folderName === 'desktop') {
    return path.join(homeDir, 'Desktop');
  }

  if (folderName === 'documents') {
    return path.join(homeDir, 'Documents');
  }

  return null;
}
