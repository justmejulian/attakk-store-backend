import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createTestOrderService } from './helpers.ts';
import { createOrderHandlers } from '../src/routes/orders.ts';
import { createStatsHandlers } from '../src/routes/stats.ts';
import { createHealthHandler } from '../src/routes/health.ts';

describe('Order Routes', () => {
  it('should create an order', async () => {
    const { db, service } = createTestOrderService();
    const handlers = createOrderHandlers(service);

    const req = {
      body: {
        email: 'test@example.com',
        phone: '+1234567890',
        line_items: [{ price_id: 'price_test', quantity: 2 }],
      },
    } as any;

    const res = {
      status: (code: number) => {
        assert.strictEqual(code, 201);
        return res;
      },
      json: (data: any) => {
        assert.strictEqual(data.success, true);
        assert.strictEqual(data.data.id, 1);
        assert.ok(data.data.reference_number);
        assert.strictEqual(data.data.email, 'test@example.com');
      },
    } as any;

    const next = (err?: Error) => {
      if (err) throw err;
    };

    await handlers.createOrderHandler(req, res, next);
  });

  it('should validate create order body', async () => {
    const { service } = createTestOrderService();
    const handlers = createOrderHandlers(service);

    const req = {
      body: {
        email: 'invalid-email',
        line_items: [],
      },
    } as any;

    let statusCode = 200;
    let responseData: any = null;

    const res = {
      status: (code: number) => {
        statusCode = code;
        return res;
      },
      json: (data: any) => {
        responseData = data;
      },
    } as any;

    const next = (err?: any) => {
      assert.ok(err);
      assert.strictEqual(err.code, 'VALIDATION_ERROR');
    };

    await handlers.createOrderHandler(req, res, next);
  });

  it('should list orders', async () => {
    const { service } = createTestOrderService();
    const handlers = createOrderHandlers(service);

    service.createOrder({
      email: 'test1@example.com',
      line_items: [{ price_id: 'price_a', quantity: 1 }],
    });
    service.createOrder({
      email: 'test2@example.com',
      line_items: [{ price_id: 'price_b', quantity: 2 }],
    });

    const req = {
      query: {
        limit: '10',
        offset: '0',
      },
    } as any;

    const res = {
      json: (data: any) => {
        assert.strictEqual(data.success, true);
        assert.strictEqual(data.data.orders.length, 2);
        assert.strictEqual(data.data.pagination.total, 2);
        assert.strictEqual(data.data.pagination.limit, 10);
        assert.strictEqual(data.data.pagination.offset, 0);
      },
    } as any;

    const next = (err?: Error) => {
      if (err) throw err;
    };

    await handlers.listOrdersHandler(req, res, next);
  });

  it('should validate list orders query params', async () => {
    const { service } = createTestOrderService();
    const handlers = createOrderHandlers(service);

    const req = {
      query: {
        limit: 'invalid',
        offset: '0',
      },
    } as any;

    const next = (err?: any) => {
      assert.ok(err);
      assert.strictEqual(err.code, 'VALIDATION_ERROR');
    };

    await handlers.listOrdersHandler(req, {} as any, next);
  });
});

describe('Stats Routes', () => {
  it('should get product stats', async () => {
    const { service } = createTestOrderService();
    const handlers = createStatsHandlers(service);

    service.createOrder({
      email: 'test1@example.com',
      line_items: [{ price_id: 'price_a', quantity: 2 }],
    });
    service.createOrder({
      email: 'test2@example.com',
      line_items: [{ price_id: 'price_a', quantity: 1 }],
    });

    const req = {} as any;
    const res = {
      json: (data: any) => {
        assert.strictEqual(data.success, true);
        assert.strictEqual(data.data.products.length, 1);
        assert.strictEqual(data.data.products[0].price_id, 'price_a');
        assert.strictEqual(data.data.products[0].total_quantity, 3);
        assert.strictEqual(data.data.summary.total_orders, 2);
        assert.strictEqual(data.data.summary.total_items, 3);
      },
    } as any;

    const next = (err?: Error) => {
      if (err) throw err;
    };

    await handlers.getProductStatsHandler(req, res, next);
  });
});

describe('Health Routes', () => {
  it('should return healthy status', () => {
    const { db } = createTestOrderService();
    const handlers = createHealthHandler(db);

    const req = {} as any;
    const res = {
      json: (data: any) => {
        assert.strictEqual(data.status, 'healthy');
        assert.strictEqual(data.database, 'connected');
        assert.ok(data.timestamp);
      },
    } as any;

    handlers.healthHandler(req, res);
  });
});
