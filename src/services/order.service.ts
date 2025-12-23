import type { CreateOrderInput } from '../schemas/order.schema.ts'
import { generateReferenceNumber } from '../utils/reference.ts'
import {
  insertOrder,
  getAllOrders,
  countOrders,
  getProductStats as getProductStatsDb,
} from '../db/queries.ts'

export const createOrder = async (input: CreateOrderInput) => {
  const referenceNumber = generateReferenceNumber()
  const lineItemsJson = JSON.stringify(input.line_items)

  const orderId = await insertOrder(referenceNumber, input.email, input.phone, lineItemsJson)

  return {
    id: orderId,
    reference_number: referenceNumber,
    email: input.email,
    created_at: new Date().toISOString(),
  }
}

export const listOrders = async (limit: number, offset: number) => {
  const [orders, total] = await Promise.all([getAllOrders(limit, offset), countOrders()])

  return {
    orders,
    pagination: {
      total,
      limit,
      offset,
    },
  }
}

export const getProductStats = async () => {
  const products = await getProductStatsDb()
  const totalItems = products.reduce(
    (sum: number, p: { total_quantity: number }) => sum + p.total_quantity,
    0
  )

  return {
    products,
    summary: {
      total_orders: await countOrders(),
      total_items: totalItems,
    },
  }
}
