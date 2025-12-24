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

export type OrderRow = {
  id: number;
  reference_number: string;
  email: string;
  phone: string | null;
  line_items: string;
  created_at: string;
};

export type CountRow = {
  count: number;
};

export type ProductStat = {
  price_id: string;
  total_quantity: number;
};

export type OrderRepository = {
  insertOrder: (
    referenceNumber: string,
    email: string,
    phone: string | undefined,
    lineItemsJson: string
  ) => Promise<number>;
  getAllOrders: (limit: number, offset: number) => Promise<Order[]>;
  countOrders: () => Promise<number>;
  getProductStats: () => Promise<ProductStat[]>;
};
