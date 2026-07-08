import { getDatabase, saveDatabase } from './db.js';

export type SetupInput = {
  userName: string;
  assistantName: string;
  theme: 'system' | 'light' | 'dark';
  responseStyle: 'balanced' | 'concise' | 'detailed';
};

export type SettingsRecord = {
  userName: string;
  assistantName: string;
  preferredLanguage: string;
  theme: 'system' | 'light' | 'dark';
  modelName: string;
  responseStyle: 'balanced' | 'concise' | 'detailed';
  setupCompleted: boolean;
};

type SettingsRow = {
  assistant_name: string;
  preferred_language: string | null;
  theme: 'system' | 'light' | 'dark' | null;
  model_name: string | null;
  response_style: 'balanced' | 'concise' | 'detailed' | null;
  setup_completed: number;
};

type UserRow = {
  name: string;
};

export function getSettings(): SettingsRecord {
  const db = getDatabase();
  const settingsStatement = db.prepare('SELECT * FROM settings ORDER BY id DESC LIMIT 1');
  const settings = settingsStatement.step()
    ? (settingsStatement.getAsObject() as SettingsRow)
    : undefined;
  settingsStatement.free();

  const userStatement = db.prepare('SELECT name FROM users ORDER BY id DESC LIMIT 1');
  const user = userStatement.step() ? (userStatement.getAsObject() as UserRow) : undefined;
  userStatement.free();

  return {
    userName: user?.name ?? '',
    assistantName: settings?.assistant_name ?? 'Luna',
    preferredLanguage: settings?.preferred_language ?? 'English',
    theme: settings?.theme ?? 'system',
    modelName: settings?.model_name ?? 'qwen2.5:3b-instruct',
    responseStyle: settings?.response_style ?? 'balanced',
    setupCompleted: Boolean(settings?.setup_completed),
  };
}

export function saveSetup(data: SetupInput): SettingsRecord {
  const db = getDatabase();
  const now = new Date().toISOString();

  db.run('BEGIN TRANSACTION');

  try {
    db.run('INSERT INTO users (name, created_at) VALUES (?, ?)', [data.userName, now]);

    const statement = db.prepare('SELECT id FROM settings ORDER BY id DESC LIMIT 1');
    const existingSettings = statement.step()
      ? (statement.getAsObject() as { id: number })
      : undefined;
    statement.free();

    if (existingSettings) {
      db.run(
        `
        UPDATE settings
        SET assistant_name = ?,
            preferred_language = ?,
            theme = ?,
            model_name = ?,
            response_style = ?,
            setup_completed = 1,
            updated_at = ?
        WHERE id = ?
      `,
        [
          data.assistantName,
          'English',
          data.theme,
          'qwen2.5:3b-instruct',
          data.responseStyle,
          now,
          existingSettings.id,
        ],
      );
      db.run('COMMIT');
      saveDatabase();
      return getSettings();
    }

    db.run(
      `
      INSERT INTO settings (
        assistant_name,
        preferred_language,
        theme,
        model_name,
        response_style,
        setup_completed,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, 1, ?, ?)
    `,
      [
        data.assistantName,
        'English',
        data.theme,
        'qwen2.5:3b-instruct',
        data.responseStyle,
        now,
        now,
      ],
    );

    db.run('COMMIT');
    saveDatabase();
    return getSettings();
  } catch (error) {
    db.run('ROLLBACK');
    throw error;
  }
}
