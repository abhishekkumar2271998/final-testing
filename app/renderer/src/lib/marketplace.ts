// Shared types for the catalog (products & orders) endpoints.

export interface Product {
  id: number;
  seller: number;
  seller_name: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  buyer: number;
  product: number;
  product_name: string;
  quantity: number;
  unit_price: string;
  total: string;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  created_at: string;
}

export interface SellerStats {
  product_count: number;
  active_product_count: number;
  order_count: number;
  revenue: string;
  low_stock: Product[];
}

export interface BuyerStats {
  order_count: number;
  total_spent: string;
  by_status: { status: string; count: number }[];
  recent_orders: Order[];
}

export function formatPrice(value: string | number): string {
  const n = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(n)) return String(value);
  return `$${n.toFixed(2)}`;
}
