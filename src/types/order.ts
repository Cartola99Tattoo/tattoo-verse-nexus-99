
export type Order = {
  id: string;
  customer_id?: string;
  total_amount: number;
  payment_method: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shipping_address_id?: string;
  billing_address_id?: string;
  reference_code: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  shipping_address?: Address;
  billing_address?: Address;
  scheduling_preferences?: SchedulingPreference | null;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
  product?: Product;
};

export type Address = {
  id: string;
  customer_id?: string;
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string; // This is required
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export type SchedulingPreference = {
  id: string;
  order_id: string;
  preferred_date_1?: string;
  preferred_date_2?: string;
  preferred_date_3?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

import { Product } from './product';
