import express, { type Express } from 'express'
import type Database from 'sqlite3'
import { config } from './config.ts'
import { createRoutes } from './routes/index.ts'
import { createOrderRepository } from './db/queries.ts'
import { createOrderService } from './services/order.ts'
import { errorHandler } from './middleware/error-handler.ts'

export const createApp = (db: Database.Database): Express => {
  const app = express()

  const repo = createOrderRepository(db)
  const service = createOrderService(repo)
  const routes = createRoutes(db, service)

  app.use(express.json())

  app.use('/', routes)

  app.use(errorHandler)

  return app
}

export { config }
