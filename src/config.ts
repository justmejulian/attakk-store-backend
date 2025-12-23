const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV || 'development'
const DATABASE_PATH = process.env.DATABASE_PATH || './data/orders.db'

export const config = {
  PORT,
  NODE_ENV,
  DATABASE_PATH,
} as const
