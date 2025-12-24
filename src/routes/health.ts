import type { Request, Response } from 'express'
import type Database from 'sqlite3'

export type HealthHandlers = {
  healthHandler: (_req: Request, res: Response) => void
}

export const createHealthHandler = (db: Database.Database): HealthHandlers => {
  const healthHandler = (_req: Request, res: Response): void => {
    db.get('SELECT 1', (err: Error | null) => {
      if (err) {
        res.status(500).json({
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          database: 'disconnected',
          error: err.message,
        })
      } else {
        res.json({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          database: 'connected',
        })
      }
    })
  }

  return { healthHandler }
}
