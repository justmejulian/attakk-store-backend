import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { createInMemoryDatabase } from './helpers.ts';
import { insertOrder, getAllOrders, countOrders, getProductStats } from '../src/db/queries.ts';

describe('Order Service', () => {
  it('should create and retrieve an order', async () => {
    const mockDb = createInMemoryDatabase();

    const mockGetDb = mock.method(() => mockDb);

    const lineItems = [{ price_id: 'price_test', quantity: 2 }];
    const lineItemsJson = JSON.stringify(lineItems);

    const orderId = await insertOrder('ORD-TEST1', 'test@example.com', undefined, lineItemsJson);

    assert.strictEqual(orderId, 1);

    mockGetDb.mock.restore();
  });
});
