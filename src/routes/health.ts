import { type Request, type Response } from 'express';
import { getDb } from '../db/index.ts';

export const healthHandler = (_req: Request, res: Response) => {
  const db = getDb();
  db.get('SELECT 1', (err) => {
    if (err) {
      res.status(500).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: err.message,
      });
    } else {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
      });
    }
  });
};
