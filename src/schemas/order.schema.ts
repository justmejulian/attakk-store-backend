import { z } from 'zod';

const lineItemSchema = z.object({
  price_id: z.string().min(1),
  quantity: z.number().int().positive(),
});

export const createOrderSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  line_items: z.array(lineItemSchema).min(1),
});

export const listOrdersSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(100),
  offset: z.coerce.number().int().min(0).default(0),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type ListOrdersInput = z.infer<typeof listOrdersSchema>;
