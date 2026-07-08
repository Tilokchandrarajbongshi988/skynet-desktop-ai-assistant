import { execFile } from 'child_process';
import fs from 'fs';
import { createActivity } from '../models/activityModel.js';

type AllowedApp = 'chrome' | 'spotify' | 'notepad' | 'vscode' | 'calculator';

const appCommands: Record<AllowedApp, Array<{ command: string; args: string[] }>> = {
  chrome: [
    { command: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', args: [] },
    { command: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', args: [] },
  ],
  spotify: [
    { command: 'spotify.exe', args: [] },
  ],
  notepad: [
    { command: 'notepad.exe', args: [] },
  ],
  vscode: [
    { command: 'code.cmd', args: [] },
    { command: 'code.exe', args: [] },
  ],
  calculator: [
    { command: 'calc.exe', args: [] },
  ],
};

export function openApprovedApp(appName: AllowedApp) {
  const candidates = appCommands[appName];
  const selected = candidates.find((candidate) => {
    if (candidate.command.includes('\\')) {
      return fs.existsSync(candidate.command);
    }

    return true;
  });

  if (!selected) {
    createActivity('app_open_failed', `Could not find ${appName}`, 'failed');
    return { message: `Could not find ${appName} on this computer.` };
  }

  execFile(selected.command, selected.args, (error) => {
    if (error) {
      createActivity('app_open_failed', `Failed to open ${appName}`, 'failed');
      return;
    }

    createActivity('app_opened', `Opened ${appName}`, 'success');
  });

  return { message: `Opening ${appName}.` };
}
