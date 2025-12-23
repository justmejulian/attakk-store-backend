import Database from 'sqlite3';
import { getDb } from './index.ts';

export type LineItem = {
  price_id: string;
  quantity: number;
};

export type Order = {
  id: number;
  reference_number: string;
  email: string;
  phone: string | null;
  line_items: LineItem[];
  created_at: string;
};

export const insertOrder = (
  referenceNumber: string,
  email: string,
  phone: string | undefined,
  lineItemsJson: string
): Promise<number> => {
  return new Promise((resolve, reject) => {
    const db = getDb();
    db.run(
      'INSERT INTO orders (reference_number, email, phone, line_items, created_at) VALUES (?, ?, ?, ?, ?)',
      [referenceNumber, email, phone || null, lineItemsJson, new Date().toISOString()],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID as number);
        }
      }
    );
  });
};

export const getAllOrders = (limit: number, offset: number): Promise<Order[]> => {
  return new Promise((resolve, reject) => {
    const db = getDb();
    db.all(
      'SELECT * FROM orders ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const orders = (rows as any[]).map((row) => ({
            ...row,
            line_items: JSON.parse(row.line_items),
          }));
          resolve(orders);
        }
      }
    );
  });
};

export const countOrders = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    const db = getDb();
    db.get('SELECT COUNT(*) as count FROM orders', (err, row: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.count);
      }
    });
  });
};

export const getProductStats = (): Promise<{ price_id: string; total_quantity: number }[]> => {
  return new Promise((resolve, reject) => {
    const db = getDb();
    db.all('SELECT * FROM orders', (err, rows: any[]) => {
      if (err) {
        reject(err);
        return;
      }

      const stats = new Map<string, number>();

      for (const row of rows) {
        const lineItems: LineItem[] = JSON.parse(row.line_items);
        for (const item of lineItems) {
          const current = stats.get(item.price_id) || 0;
          stats.set(item.price_id, current + item.quantity);
        }
      }

      const result = Array.from(stats.entries()).map(([price_id, total_quantity]) => ({
        price_id,
        total_quantity,
      }));

      resolve(result);
    });
  });
};
