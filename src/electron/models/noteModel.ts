import { getDatabase } from './db.js';

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
