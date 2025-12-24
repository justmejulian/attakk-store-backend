import type Database from 'sqlite3'
import type { OrderRepository, Order, OrderRow, CountRow, LineItem, ProductStat } from './types.ts'

export const createOrderRepository = (db: Database.Database): OrderRepository => {
  const insertOrder = (
    referenceNumber: string,
    email: string,
    phone: string | undefined,
    lineItemsJson: string
  ): Promise<number> => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO orders (reference_number, email, phone, line_items, created_at) VALUES (?, ?, ?, ?, ?)',
        [referenceNumber, email, phone || null, lineItemsJson, new Date().toISOString()],
        function (err) {
          if (err) {
            reject(err)
          } else {
            resolve(this.lastID as number)
          }
        }
      )
    })
  }

  const getAllOrders = (limit: number, offset: number): Promise<Order[]> => {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM orders ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [limit, offset],
        (err, rows: OrderRow[]) => {
          if (err) {
            reject(err)
          } else {
            const orders = rows.map((row) => ({
              ...row,
              line_items: JSON.parse(row.line_items),
            }))
            resolve(orders)
          }
        }
      )
    })
  }

  const countOrders = (): Promise<number> => {
    return new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM orders', (err, row: CountRow) => {
        if (err) {
          reject(err)
        } else {
          resolve(row.count)
        }
      })
    })
  }

  const getProductStats = (): Promise<ProductStat[]> => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM orders', (err, rows: OrderRow[]) => {
        if (err) {
          reject(err)
          return
        }

        const stats = new Map<string, number>()

        for (const row of rows) {
          const lineItems: LineItem[] = JSON.parse(row.line_items)
          for (const item of lineItems) {
            const current = stats.get(item.price_id) || 0
            stats.set(item.price_id, current + item.quantity)
          }
        }

        const result = Array.from(stats.entries()).map(([price_id, total_quantity]) => ({
          price_id,
          total_quantity,
        }))

        resolve(result)
      })
    })
  }

  return { insertOrder, getAllOrders, countOrders, getProductStats }
}
