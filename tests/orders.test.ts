import { describe, it } from 'node:test'
import assert from 'node:assert'
import { createTestOrderService } from './helpers.ts'

describe('Order Repository', () => {
  it('should create an order', async () => {
    const { repo } = createTestOrderService()

    const lineItems = [{ price_id: 'price_test', quantity: 2 }]
    const lineItemsJson = JSON.stringify(lineItems)

    const orderId = await repo.insertOrder(
      'ORD-TEST1',
      'test@example.com',
      undefined,
      lineItemsJson
    )

    assert.strictEqual(orderId, 1)
  })

  it('should retrieve all orders', async () => {
    const { repo } = createTestOrderService()

    await repo.insertOrder(
      'ORD-1',
      'test1@example.com',
      undefined,
      JSON.stringify([{ price_id: 'price_a', quantity: 1 }])
    )
    await repo.insertOrder(
      'ORD-2',
      'test2@example.com',
      undefined,
      JSON.stringify([{ price_id: 'price_b', quantity: 2 }])
    )

    const orders = await repo.getAllOrders(10, 0)

    assert.strictEqual(orders.length, 2)
    assert.strictEqual(orders[0].reference_number, 'ORD-2')
    assert.strictEqual(orders[1].reference_number, 'ORD-1')
  })

  it('should count orders', async () => {
    const { repo } = createTestOrderService()

    await repo.insertOrder('ORD-1', 'test1@example.com', undefined, JSON.stringify([]))
    await repo.insertOrder('ORD-2', 'test2@example.com', undefined, JSON.stringify([]))
    await repo.insertOrder('ORD-3', 'test3@example.com', undefined, JSON.stringify([]))

    const count = await repo.countOrders()

    assert.strictEqual(count, 3)
  })
})

describe('Order Service', () => {
  it('should create an order via service', async () => {
    const { service } = createTestOrderService()

    const input = {
      email: 'test@example.com',
      phone: '+1234567890',
      line_items: [{ price_id: 'price_test', quantity: 2 }],
    }

    const result = await service.createOrder(input)

    assert.strictEqual(result.id, 1)
    assert.ok(result.reference_number)
    assert.strictEqual(result.email, 'test@example.com')
  })

  it('should list orders via service', async () => {
    const { service } = createTestOrderService()

    await service.createOrder({
      email: 'test1@example.com',
      line_items: [{ price_id: 'price_a', quantity: 1 }],
    })
    await service.createOrder({
      email: 'test2@example.com',
      line_items: [{ price_id: 'price_b', quantity: 2 }],
    })

    const result = await service.listOrders(10, 0)

    assert.strictEqual(result.orders.length, 2)
    assert.strictEqual(result.pagination.total, 2)
    assert.strictEqual(result.pagination.limit, 10)
    assert.strictEqual(result.pagination.offset, 0)
  })
})
