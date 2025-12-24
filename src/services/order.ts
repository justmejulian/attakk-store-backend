import type { CreateOrderInput } from '../schemas/order.schema.ts';
import type { OrderRepository } from '../db/types.ts';
import { generateReferenceNumber } from '../utils/reference.ts';

export type CreatedOrderResponse = {
  id: number;
  reference_number: string;
  email: string;
  created_at: string;
};

export type ListOrdersResponse = {
  orders: import('../db/types.ts').Order[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
};

export type ProductStatsResponse = {
  products: import('../db/types.ts').ProductStat[];
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

export const createOrderService = (repo: OrderRepository): OrderService => {
  const createOrder = (input: CreateOrderInput): CreatedOrderResponse => {
    const referenceNumber = generateReferenceNumber();
    const lineItemsJson = JSON.stringify(input.line_items);

    const orderId = repo.insertOrder(referenceNumber, input.email, input.phone, lineItemsJson);

    return {
      id: orderId,
      reference_number: referenceNumber,
      email: input.email,
      created_at: new Date().toISOString(),
    };
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
