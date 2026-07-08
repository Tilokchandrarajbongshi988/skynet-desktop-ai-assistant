import { getDatabase } from './db.js';

export type MemoryRecord = {
  id: number;
  content: string;
  category: string | null;
  createdAt: string;
};

type MemoryRow = {
  id: number;
  content: string;
  category: string | null;
  created_at: string;
};

export function getMemories(): MemoryRecord[] {
  const statement = getDatabase().prepare('SELECT * FROM memories ORDER BY id DESC');
  const rows: MemoryRow[] = [];

  while (statement.step()) {
    rows.push(statement.getAsObject() as MemoryRow);
  }
  statement.free();

  return rows.map((row) => ({
    id: row.id,
    content: row.content,
    category: row.category,
    createdAt: row.created_at,
  }));
}
