import path from 'path';
import { createRequire } from 'node:module';
import {isDev} from './utils.js'

const require = createRequire(import.meta.url);
const { app } = require('electron');

export function getPreloadPath() {
  return path.join(
    app.getAppPath(),
    isDev() ? '.' : '..',
    'dist-electron',
    'preload.cjs'
  );
}
