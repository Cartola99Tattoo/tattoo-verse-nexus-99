
import { Artist, Product } from './product';

export type CartItem = {
  id: string;
  product_id: string; // Make sure this is a string
  name?: string;
  price: number;
  quantity: number;
  images?: string[];
  product?: Product;
  artist?: Artist | string; // Allow both Artist object or string
  status: string;
  created_at: string;
  updated_at: string;
};

export type CartContextType = {
  cart: string | null;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  addToCart: (product: Partial<CartItem>, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getItemCount: () => number;
  getSubtotal: () => number;
  addItem: (product: Partial<CartItem>, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
};
