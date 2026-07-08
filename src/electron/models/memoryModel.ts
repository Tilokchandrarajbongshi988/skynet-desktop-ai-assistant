import { getDatabase, getLastInsertId, saveDatabase } from './db.js';
import { createActivity } from './activityModel.js';

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

export function createMemory(content: string, category = 'preference') {
  const trimmedContent = content.trim();

  if (!trimmedContent) {
    return null;
  }

  getDatabase().run('INSERT INTO memories (content, category, created_at) VALUES (?, ?, ?)', [
    trimmedContent,
    category,
    new Date().toISOString(),
  ]);
  saveDatabase();
  createActivity('memory_created', trimmedContent);

  return getMemoryById(getLastInsertId());
}

export function deleteMemory(id: number) {
  const memory = getMemoryById(id);

  if (!memory) {
    return false;
  }

  getDatabase().run('DELETE FROM memories WHERE id = ?', [id]);
  saveDatabase();
  createActivity('memory_deleted', memory.content);

  return true;
}

export function clearMemories() {
  const count = getMemories().length;

  getDatabase().run('DELETE FROM memories');
  saveDatabase();
  createActivity('memories_cleared', `Cleared ${count} memories`);

  return true;
}

function getMemoryById(id: number): MemoryRecord | null {
  const statement = getDatabase().prepare('SELECT * FROM memories WHERE id = ? LIMIT 1');
  statement.bind([id]);

  const row = statement.step() ? (statement.getAsObject() as MemoryRow) : null;
  statement.free();

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    content: row.content,
    category: row.category,
    createdAt: row.created_at,
  };
}
