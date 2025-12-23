import type { Request, Response, NextFunction } from 'express';
import { createOrderSchema, listOrdersSchema } from '../schemas/order.schema.ts';
import { createOrder, listOrders } from '../services/order.service.ts';
import { createError } from '../middleware/error-handler.ts';

export const createOrderHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validationResult = createOrderSchema.safeParse(req.body);
    if (!validationResult.success) {
      throw createError('VALIDATION_ERROR', 'Invalid request body', validationResult.error.issues);
    }

    const data = await createOrder(validationResult.data);

    res.status(201).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const listOrdersHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validationResult = listOrdersSchema.safeParse(req.query);
    if (!validationResult.success) {
      throw createError('VALIDATION_ERROR', 'Invalid query parameters', validationResult.error.issues);
    }

    const data = await listOrders(validationResult.data.limit, validationResult.data.offset);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};
