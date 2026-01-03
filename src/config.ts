const PORT = process.env.PORT || 3000;
const DATABASE_PATH = process.env.DATABASE_PATH || './data/orders.db';

export const config = {
  PORT,
  DATABASE_PATH,
} as const;
