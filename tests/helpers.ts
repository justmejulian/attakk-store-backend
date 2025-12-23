import Database from 'sqlite3';

export const createInMemoryDatabase = (): Database.Database => {
  const db = new Database.Database(':memory:');

  db.exec(`
    CREATE TABLE orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference_number TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL,
      phone TEXT,
      line_items TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  return db;
};
