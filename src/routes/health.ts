import { type Request, type Response } from 'express'

export const healthHandler = (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  })
}
