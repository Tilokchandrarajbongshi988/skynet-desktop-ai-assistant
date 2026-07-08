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

export function sendFakeMessage(content: string) {
  const db = getDatabase();
  const conversationId = getOrCreateConversation();
  const now = new Date().toISOString();

  db.run('BEGIN TRANSACTION');

  try {
    db.run(
      'INSERT INTO messages (conversation_id, role, content, created_at) VALUES (?, ?, ?, ?)',
      [conversationId, 'user', content, now],
    );

    db.run(
      'INSERT INTO messages (conversation_id, role, content, created_at) VALUES (?, ?, ?, ?)',
      [conversationId, 'assistant', 'I received your message.', new Date().toISOString()],
    );

    db.run('UPDATE conversations SET updated_at = ? WHERE id = ?', [
      new Date().toISOString(),
      conversationId,
    ]);
    db.run('COMMIT');
    saveDatabase();
  } catch (error) {
    db.run('ROLLBACK');
    throw error;
  }

  return getMessages(conversationId);
}
