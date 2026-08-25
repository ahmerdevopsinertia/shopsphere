export interface OrderItem {
  productId: string;
  product: {
    name: string
  };
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  paymentReference: string | null;
  items: OrderItem[];
}

export interface OrderPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OrderListResponse {
  data: Order[];
  meta: OrderPaginationMeta;
}