import type { Request, Response, NextFunction } from 'express';
import type { OrderService } from '../services/order.ts';

export type StatsHandlers = {
  getProductStatsHandler: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
};

export const createStatsHandlers = (service: OrderService): StatsHandlers => {
  const getProductStatsHandler = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = await service.getProductStats();

      res.json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  };

  return { getProductStatsHandler };
};
