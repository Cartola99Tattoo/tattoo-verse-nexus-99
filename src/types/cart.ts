
export type Cart = {
  id: string;
  customer_id?: string;
  created_at: string;
  updated_at: string;
  items?: CartItem[];
};

export type CartItem = {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
  product?: Product;
};

import { Product } from './product';
