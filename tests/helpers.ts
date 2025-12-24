import Database from 'sqlite3'
import { createOrderRepository } from '../src/db/queries.ts'
import { createOrderService } from '../src/services/order.ts'

export const createInMemoryDatabase = (): Database.Database => {
  const db = new Database.Database(':memory:')

  db.exec(`
    CREATE TABLE orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference_number TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL,
      phone TEXT,
      line_items TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `)

  return db
}

export const createTestOrderService = () => {
  const db = createInMemoryDatabase()
  const repo = createOrderRepository(db)
  const service = createOrderService(repo)

  return { db, repo, service }
}
