import { DatabaseSync } from 'node:sqlite';
import { config } from '../config.ts';

export const createDatabase = (path: string = config.DATABASE_PATH): DatabaseSync => {
  return new DatabaseSync(path);
};

export const initializeDatabase = (db: DatabaseSync): void => {
  const row = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='orders'")
    .get();
  if (!row) {
    db.exec(`CREATE TABLE orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference_number TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL,
      phone TEXT,
      line_items TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`);
  }
};
