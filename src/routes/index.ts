import { Router } from 'express';
import type Database from 'better-sqlite3';
import type { OrderService } from '../services/order';
import { createOrderHandlers } from './orders';
import { createStatsHandlers } from './stats';
import { createHealthHandler } from './health';

export const createRoutes = (db: Database.Database, service: OrderService): Router => {
  const router = Router();

  const { healthHandler } = createHealthHandler(db);
  const { createOrderHandler, listOrdersHandler } = createOrderHandlers(service);
  const { getProductStatsHandler } = createStatsHandlers(service);

  router.get('/health', healthHandler);
  router.post('/orders', createOrderHandler);
  router.get('/orders', listOrdersHandler);
  router.get('/stats/products', getProductStatsHandler);

  return router;
};
