import fs from 'fs';
import path from 'path';
import { createActivity } from '../models/activityModel.js';
import { createNote } from '../models/noteModel.js';
import { getUserDataPath } from '../utils/paths.js';

type CreateNoteInput = {
  title: string;
  content: string;
};

export function createNoteFile({ title, content }: CreateNoteInput) {
  const notesDirectory = getUserDataPath('Luna Notes');
  fs.mkdirSync(notesDirectory, { recursive: true });

  const safeTitle = sanitizeFileName(title || 'Untitled note');
  const filePath = path.join(notesDirectory, `${safeTitle}-${Date.now()}.txt`);
  fs.writeFileSync(filePath, content || '', 'utf8');

  const note = createNote(title || 'Untitled note', content || '', filePath);
  createActivity('note_created', `Created note "${title}"`, 'success');

  return {
    message: `Created note "${title || 'Untitled note'}".`,
    note,
  };
}

function sanitizeFileName(value: string) {
  return value.replace(/[<>:"/\\|?*]/g, '').trim().slice(0, 80) || 'Untitled note';
}
