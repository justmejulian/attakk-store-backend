import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createTestOrderService } from './helpers.ts';

describe('Stats Repository', () => {
  it('should aggregate product quantities', async () => {
    const { repo } = createTestOrderService();

    await repo.insertOrder(
      'ORD-1',
      'test1@example.com',
      undefined,
      JSON.stringify([{ price_id: 'price_a', quantity: 2 }])
    );
    await repo.insertOrder(
      'ORD-2',
      'test2@example.com',
      undefined,
      JSON.stringify([{ price_id: 'price_a', quantity: 1 }])
    );
    await repo.insertOrder(
      'ORD-3',
      'test3@example.com',
      undefined,
      JSON.stringify([{ price_id: 'price_b', quantity: 3 }])
    );

    const stats = await repo.getProductStats();

    assert.strictEqual(stats.length, 2);
    assert.strictEqual(stats.find((s) => s.price_id === 'price_a')?.total_quantity, 3);
    assert.strictEqual(stats.find((s) => s.price_id === 'price_b')?.total_quantity, 3);
  });
});

describe('Stats Service', () => {
  it('should get product stats via service', async () => {
    const { service } = createTestOrderService();

    await service.createOrder({
      email: 'test1@example.com',
      line_items: [{ price_id: 'price_a', quantity: 2 }],
    });
    await service.createOrder({
      email: 'test2@example.com',
      line_items: [{ price_id: 'price_a', quantity: 1 }],
    });
    await service.createOrder({
      email: 'test3@example.com',
      line_items: [{ price_id: 'price_b', quantity: 3 }],
    });

    const result = await service.getProductStats();

    assert.strictEqual(result.products.length, 2);
    assert.strictEqual(result.summary.total_orders, 3);
    assert.strictEqual(result.summary.total_items, 6);
  });
});
