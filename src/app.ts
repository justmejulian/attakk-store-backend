import express, { type Express } from 'express';
import { config } from './config';
import { createRoutes } from './routes/index';
import { createOrderRepository } from './db/queries';
import { createOrderService } from './services/order';
import { errorHandler } from './middleware/error-handler';
import type { DatabaseSync } from 'node:sqlite';

export const createApp = (db: DatabaseSync): Express => {
  const app = express();

  const repo = createOrderRepository(db);
  const service = createOrderService(repo);
  const routes = createRoutes(db, service);

  app.use(express.json());

  app.use('/', routes);

  app.use(errorHandler);

  return app;
};

export { config };
