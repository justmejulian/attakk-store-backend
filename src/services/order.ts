import type { CreateOrderInput } from '../schemas/order.schema';
import type { OrderRepository } from '../db/types';
import { generateReferenceNumber } from '../utils/reference';

export type CreatedOrderResponse = {
  id: number;
  reference_number: string;
  email: string;
  line_items: { price_id: string; quantity: number }[];
  created_at: string;
};

export type ListOrdersResponse = {
  orders: import('../db/types').Order[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
};

export type ProductStatsResponse = {
  products: import('../db/types').ProductStat[];
  summary: {
    total_orders: number;
    total_items: number;
  };
};

export type OrderService = {
  createOrder: (input: CreateOrderInput) => CreatedOrderResponse;
  listOrders: (limit: number, offset: number) => ListOrdersResponse;
  getProductStats: () => ProductStatsResponse;
};

const isUniqueConstraintError = (error: unknown): boolean => {
  return (
    error instanceof Error &&
    'code' in error &&
    (error as { code: string }).code === 'SQLITE_CONSTRAINT_UNIQUE'
  );
};

export const createOrderService = (repo: OrderRepository): OrderService => {
  const createOrder = (input: CreateOrderInput): CreatedOrderResponse => {
    const lineItemsJson = JSON.stringify(input.line_items);
    const maxRetries = 100;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const referenceNumber = generateReferenceNumber();

      try {
        const orderId = repo.insertOrder(referenceNumber, input.email, input.phone, lineItemsJson);

        return {
          id: orderId,
          reference_number: referenceNumber,
          email: input.email,
          line_items: input.line_items,
          created_at: new Date().toISOString(),
        };
      } catch (error) {
        if (isUniqueConstraintError(error) && attempt < maxRetries - 1) {
          continue;
        }
        throw error;
      }
    }

    throw new Error('Failed to generate unique reference number after multiple attempts');
  };

  const listOrders = (limit: number, offset: number): ListOrdersResponse => {
    const [orders, total] = [repo.getAllOrders(limit, offset), repo.countOrders()];

    return {
      orders,
      pagination: {
        total,
        limit,
        offset,
      },
    };
  };

  const getProductStats = (): ProductStatsResponse => {
    const products = repo.getProductStats();
    const totalItems = products.reduce(
      (sum: number, p: { total_quantity: number }) => sum + p.total_quantity,
      0
    );

    return {
      products,
      summary: {
        total_orders: repo.countOrders(),
        total_items: totalItems,
      },
    };
  };

  return { createOrder, listOrders, getProductStats };
};
