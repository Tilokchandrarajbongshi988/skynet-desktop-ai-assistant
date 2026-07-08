import { getDatabase, getLastInsertId, saveDatabase } from './db.js';

export type ChatMessageRecord = {
  id: number;
  conversationId: number;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};

type MessageRow = {
  id: number;
  conversation_id: number;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

function mapMessage(row: MessageRow): ChatMessageRecord {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    role: row.role,
    content: row.content,
    createdAt: row.created_at,
  };
}

export function getOrCreateConversation() {
  const db = getDatabase();
  const statement = db.prepare('SELECT id FROM conversations ORDER BY id ASC LIMIT 1');
  const existing = statement.step() ? (statement.getAsObject() as { id: number }) : undefined;
  statement.free();

  if (existing) {
    return existing.id;
  }

  const now = new Date().toISOString();
  db.run('INSERT INTO conversations (title, created_at, updated_at) VALUES (?, ?, ?)', [
    'First conversation',
    now,
    now,
  ]);
  saveDatabase();

  return getLastInsertId();
}

export function getMessages(conversationId = getOrCreateConversation()) {
  const statement = getDatabase().prepare(
    'SELECT * FROM messages WHERE conversation_id = ? ORDER BY id ASC',
  );
  statement.bind([conversationId]);

  const rows: MessageRow[] = [];
  while (statement.step()) {
    rows.push(statement.getAsObject() as MessageRow);
  }
  statement.free();

  return rows.map(mapMessage);
}

export function getRecentMessages(conversationId = getOrCreateConversation(), limit = 12) {
  const statement = getDatabase().prepare(
    `SELECT *
     FROM messages
     WHERE conversation_id = ?
     ORDER BY id DESC
     LIMIT ?`,
  );
  statement.bind([conversationId, limit]);

  const rows: MessageRow[] = [];
  while (statement.step()) {
    rows.push(statement.getAsObject() as MessageRow);
  }
  statement.free();

  return rows.reverse().map(mapMessage);
}

export function saveMessage(
  conversationId: number,
  role: ChatMessageRecord['role'],
  content: string,
) {
  const db = getDatabase();
  const now = new Date().toISOString();

  db.run('INSERT INTO messages (conversation_id, role, content, created_at) VALUES (?, ?, ?, ?)', [
    conversationId,
    role,
    content,
    now,
  ]);
  db.run('UPDATE conversations SET updated_at = ? WHERE id = ?', [now, conversationId]);
  saveDatabase();

  return getLastInsertId();
}
