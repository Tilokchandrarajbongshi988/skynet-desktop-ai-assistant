import { getDatabase, getLastInsertId, saveDatabase } from './db.js';

export type NoteRecord = {
  id: number;
  title: string;
  content: string | null;
  filePath: string | null;
  createdAt: string;
};

type NoteRow = {
  id: number;
  title: string;
  content: string | null;
  file_path: string | null;
  created_at: string;
};

export function getNotes(): NoteRecord[] {
  const statement = getDatabase().prepare('SELECT * FROM notes ORDER BY id DESC');
  const rows: NoteRow[] = [];

  while (statement.step()) {
    rows.push(statement.getAsObject() as NoteRow);
  }
  statement.free();

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    filePath: row.file_path,
    createdAt: row.created_at,
  }));
}

export function createNote(title: string, content: string, filePath: string) {
  getDatabase().run(
    'INSERT INTO notes (title, content, file_path, created_at) VALUES (?, ?, ?, ?)',
    [title, content, filePath, new Date().toISOString()],
  );
  saveDatabase();

  return getNoteById(getLastInsertId());
}

function getNoteById(id: number): NoteRecord | null {
  const statement = getDatabase().prepare('SELECT * FROM notes WHERE id = ? LIMIT 1');
  statement.bind([id]);

  const row = statement.step() ? (statement.getAsObject() as NoteRow) : null;
  statement.free();

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    title: row.title,
    content: row.content,
    filePath: row.file_path,
    createdAt: row.created_at,
  };
}
