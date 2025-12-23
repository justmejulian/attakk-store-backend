import { describe, it, mock } from 'node:test'
import assert from 'node:assert'
import { createInMemoryDatabase } from './helpers.ts'
import { getProductStats } from '../src/db/queries.ts'
import * as dbModule from '../src/db/index.ts'

describe('Stats Service', () => {
  it('should aggregate product quantities', async () => {
    const mockDb = createInMemoryDatabase()

    mock.method(dbModule, 'getDb', () => mockDb)

    const insertOrder = async (
      referenceNumber: string,
      email: string,
      lineItemsJson: string
    ): Promise<number> => {
      return new Promise((resolve, reject) => {
        mockDb.run(
          'INSERT INTO orders (reference_number, email, phone, line_items, created_at) VALUES (?, ?, ?, ?, ?)',
          [referenceNumber, email, null, lineItemsJson, new Date().toISOString()],
          function (err) {
            if (err) reject(err)
            else resolve(this.lastID as number)
          }
        )
      })
    }

    await insertOrder(
      'ORD-1',
      'test1@example.com',
      JSON.stringify([{ price_id: 'price_a', quantity: 2 }])
    )
    await insertOrder(
      'ORD-2',
      'test2@example.com',
      JSON.stringify([{ price_id: 'price_a', quantity: 1 }])
    )
    await insertOrder(
      'ORD-3',
      'test3@example.com',
      JSON.stringify([{ price_id: 'price_b', quantity: 3 }])
    )

    const stats = await getProductStats()

    assert.strictEqual(stats.length, 2)
    assert.strictEqual(stats.find((s) => s.price_id === 'price_a')?.total_quantity, 3)
    assert.strictEqual(stats.find((s) => s.price_id === 'price_b')?.total_quantity, 3)

    mock.restoreAll()
  })
})
