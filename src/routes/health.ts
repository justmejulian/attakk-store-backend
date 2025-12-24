import type { Request, Response } from 'express';
import type { DatabaseSync } from 'node:sqlite';

export type HealthHandlers = {
  healthHandler: (_req: Request, res: Response) => void;
};

export const createHealthHandler = (db: DatabaseSync): HealthHandlers => {
  const healthHandler = (_req: Request, res: Response): void => {
    try {
      db.prepare('SELECT 1').get();
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
      });
    } catch (err) {
      res.status(500).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  };

  return { healthHandler };
};
