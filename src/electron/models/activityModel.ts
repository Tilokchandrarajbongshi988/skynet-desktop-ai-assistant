import { getDatabase } from './db.js';

export type ActivityRecord = {
  id: number;
  actionType: string;
  description: string | null;
  status: string | null;
  createdAt: string;
};

type ActivityRow = {
  id: number;
  action_type: string;
  description: string | null;
  status: string | null;
  created_at: string;
};

export function getActivities(): ActivityRecord[] {
  const statement = getDatabase().prepare('SELECT * FROM activities ORDER BY id DESC');
  const rows: ActivityRow[] = [];

  while (statement.step()) {
    rows.push(statement.getAsObject() as ActivityRow);
  }
  statement.free();

  return rows.map((row) => ({
    id: row.id,
    actionType: row.action_type,
    description: row.description,
    status: row.status,
    createdAt: row.created_at,
  }));
}
