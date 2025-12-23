import type { Request, Response, NextFunction } from 'express';
import { getProductStats } from '../services/order.service.ts';

export const getProductStatsHandler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getProductStats();

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};
