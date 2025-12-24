import type { Request, Response, NextFunction } from 'express'
import type { OrderService } from '../services/order.ts'
import { createOrderSchema, listOrdersSchema } from '../schemas/order.schema.ts'
import { createError } from '../middleware/error-handler.ts'

export type OrderHandlers = {
  createOrderHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>
  listOrdersHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>
}

export const createOrderHandlers = (service: OrderService): OrderHandlers => {
  const createOrderHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validationResult = createOrderSchema.safeParse(req.body)
      if (!validationResult.success) {
        throw createError('VALIDATION_ERROR', 'Invalid request body', validationResult.error.issues)
      }

      const data = await service.createOrder(validationResult.data)

      res.status(201).json({
        success: true,
        data,
      })
    } catch (err) {
      next(err)
    }
  }

  const listOrdersHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validationResult = listOrdersSchema.safeParse(req.query)
      if (!validationResult.success) {
        throw createError(
          'VALIDATION_ERROR',
          'Invalid query parameters',
          validationResult.error.issues
        )
      }

      const data = await service.listOrders(
        validationResult.data.limit,
        validationResult.data.offset
      )

      res.json({
        success: true,
        data,
      })
    } catch (err) {
      next(err)
    }
  }

  return { createOrderHandler, listOrdersHandler }
}
