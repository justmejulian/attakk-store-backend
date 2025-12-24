import type { CreateOrderInput } from '../schemas/order.schema.ts'
import type { OrderRepository } from '../db/types.ts'
import { generateReferenceNumber } from '../utils/reference.ts'

export type CreatedOrderResponse = {
  id: number
  reference_number: string
  email: string
  created_at: string
}

export type ListOrdersResponse = {
  orders: import('../db/types.ts').Order[]
  pagination: {
    total: number
    limit: number
    offset: number
  }
}

export type ProductStatsResponse = {
  products: import('../db/types.ts').ProductStat[]
  summary: {
    total_orders: number
    total_items: number
  }
}

export type OrderService = {
  createOrder: (input: CreateOrderInput) => Promise<CreatedOrderResponse>
  listOrders: (limit: number, offset: number) => Promise<ListOrdersResponse>
  getProductStats: () => Promise<ProductStatsResponse>
}

export const createOrderService = (repo: OrderRepository): OrderService => {
  const createOrder = async (input: CreateOrderInput): Promise<CreatedOrderResponse> => {
    const referenceNumber = generateReferenceNumber()
    const lineItemsJson = JSON.stringify(input.line_items)

    const orderId = await repo.insertOrder(referenceNumber, input.email, input.phone, lineItemsJson)

    return {
      id: orderId,
      reference_number: referenceNumber,
      email: input.email,
      created_at: new Date().toISOString(),
    }
  }

  const listOrders = async (limit: number, offset: number): Promise<ListOrdersResponse> => {
    const [orders, total] = await Promise.all([
      repo.getAllOrders(limit, offset),
      repo.countOrders(),
    ])

    return {
      orders,
      pagination: {
        total,
        limit,
        offset,
      },
    }
  }

  const getProductStats = async (): Promise<ProductStatsResponse> => {
    const products = await repo.getProductStats()
    const totalItems = products.reduce(
      (sum: number, p: { total_quantity: number }) => sum + p.total_quantity,
      0
    )

    return {
      products,
      summary: {
        total_orders: await repo.countOrders(),
        total_items: totalItems,
      },
    }
  }

  return { createOrder, listOrders, getProductStats }
}
