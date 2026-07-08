import path from 'path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { app } = require('electron');

export function getUserDataPath(...segments: string[]) {
  return path.join(app.getPath('userData'), ...segments);
}
