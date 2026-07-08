import fs from 'fs';
import path from 'path';
import { createActivity } from '../models/activityModel.js';

export type FileSearchResult = {
  name: string;
  path: string;
};

export function searchFileNames(folderPath: string, query: string): FileSearchResult[] {
  const normalizedQuery = query.toLowerCase();

  const results = fs
    .readdirSync(folderPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().includes(normalizedQuery))
    .map((entry) => ({
      name: entry.name,
      path: path.join(folderPath, entry.name),
    }));

  createActivity(
    'files_searched',
    `Searched "${query}" in ${folderPath}. Found ${results.length} matches.`,
    'success',
  );

  return results;
}
