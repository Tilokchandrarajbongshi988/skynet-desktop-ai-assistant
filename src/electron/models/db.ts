import fs from 'fs';
import path from 'path';
import initSqlJs, { type Database, type SqlJsStatic } from 'sql.js';
import { getUserDataPath } from '../utils/paths.js';

let sql: SqlJsStatic | null = null;
let database: Database | null = null;
let databaseFilePath = '';

export function getDatabase() {
  if (!database) {
    throw new Error('Database has not been initialized.');
  }

  return database;
}

export async function initializeDatabase(filePath = getDatabasePath()) {
  databaseFilePath = filePath;
  fs.mkdirSync(path.dirname(databaseFilePath), { recursive: true });

  sql = await initSqlJs({
    locateFile: (file) => path.join(process.cwd(), 'node_modules', 'sql.js', 'dist', file),
  });

  const existingData = fs.existsSync(databaseFilePath)
    ? fs.readFileSync(databaseFilePath)
    : undefined;

  database = existingData ? new sql.Database(existingData) : new sql.Database();
  createTables(database);
  saveDatabase();

  return database;
}

export function saveDatabase() {
  if (!database || !databaseFilePath) {
    return;
  }

  fs.writeFileSync(databaseFilePath, Buffer.from(database.export()));
}

export function getDatabasePath() {
  return getUserDataPath('database', 'luna.sqlite');
}

export function getLastInsertId() {
  const result = getDatabase().exec('SELECT last_insert_rowid() AS id');

  if (!result[0]?.values[0]?.[0]) {
    return 0;
  }

  return Number(result[0].values[0][0]);
}

function createTables(db: Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      assistant_name TEXT NOT NULL,
      preferred_language TEXT,
      theme TEXT,
      model_name TEXT,
      response_style TEXT,
      setup_completed INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversation_id INTEGER,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS memories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      category TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT,
      file_path TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action_type TEXT NOT NULL,
      description TEXT,
      status TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      permission_name TEXT NOT NULL,
      granted INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);
}
