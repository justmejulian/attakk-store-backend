import { DatabaseSync } from 'node:sqlite';
import type { OrderRepository, Order, OrderRow, CountRow, LineItem, ProductStat } from './types.ts';

export const createOrderRepository = (db: DatabaseSync): OrderRepository => {
  const insertOrder = (
    referenceNumber: string,
    email: string,
    phone: string | undefined,
    lineItemsJson: string
  ): number => {
    const stmt = db.prepare(
      'INSERT INTO orders (reference_number, email, phone, line_items, created_at) VALUES (?, ?, ?, ?, ?)'
    );
    const result = stmt.run(
      referenceNumber,
      email,
      phone || null,
      lineItemsJson,
      new Date().toISOString()
    );
    return result.lastInsertRowid as number;
  };

  const getAllOrders = (limit: number, offset: number): Order[] => {
    const stmt = db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT ? OFFSET ?');
    const rows = stmt.all(limit, offset) as OrderRow[];
    return rows.map((row) => ({
      ...row,
      line_items: JSON.parse(row.line_items),
    }));
  };

  const countOrders = (): number => {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM orders');
    const row = stmt.get() as CountRow;
    return row!.count;
  };

  const getProductStats = (): ProductStat[] => {
    const stmt = db.prepare('SELECT * FROM orders');
    const rows = stmt.all() as OrderRow[];
    const stats = new Map<string, number>();

    for (const row of rows) {
      const lineItems: LineItem[] = JSON.parse(row.line_items);
      for (const item of lineItems) {
        const current = stats.get(item.price_id) || 0;
        stats.set(item.price_id, current + item.quantity);
      }
    }

    return Array.from(stats.entries()).map(([price_id, total_quantity]) => ({
      price_id,
      total_quantity,
    }));
  };

  return { insertOrder, getAllOrders, countOrders, getProductStats };
};
