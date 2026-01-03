import Database from 'better-sqlite3';
import { config } from '../config';

export const createDatabase = (path: string = config.DATABASE_PATH): Database.Database => {
  return new Database(path);
};

export const initializeDatabase = (db: Database.Database): void => {
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
