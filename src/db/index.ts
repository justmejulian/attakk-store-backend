import Database from 'sqlite3'
import { config } from '../config.ts'

export const createDatabase = (path: string = config.DATABASE_PATH): Database.Database => {
  return new Database.Database(path)
}

export const initializeDatabase = (db: Database.Database): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='orders'", (err, row) => {
      if (err) {
        reject(err)
        return
      }

      if (!row) {
        db.run(
          `CREATE TABLE orders (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              reference_number TEXT NOT NULL UNIQUE,
              email TEXT NOT NULL,
              phone TEXT,
              line_items TEXT NOT NULL,
              created_at TEXT NOT NULL
            )`,
          (createErr) => {
            if (createErr) {
              reject(createErr)
            } else {
              resolve()
            }
          }
        )
      } else {
        resolve()
      }
    })
  })
}
