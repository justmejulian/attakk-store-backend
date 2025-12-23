import Database from 'sqlite3'
import { config } from '../config.ts'

let db: Database.Database | null = null

export const getDb = (): Database.Database => {
  if (!db) {
    db = new Database.Database(config.DATABASE_PATH)
  }
  return db
}

export const initializeDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const database = getDb()
    database.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='orders'",
      (err, row) => {
        if (err) {
          reject(err)
          return
        }

        if (!row) {
          database.run(
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
      }
    )
  })
}
