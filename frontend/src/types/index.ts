export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  INVENTORY_RESERVED = 'INVENTORY_RESERVED',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export interface OrderItem {
  id?: number;
  productId: string;
  quantity: number;
}

export interface Order {
  id: number;
  externalId: string;
  clientOrderId: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderRequest {
  clientOrderId: string;
  total: number;
  items: {
    productId: string;
    quantity: number;
  }[];
}
