
export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  category_id?: string;
  artist_id?: string;
  tags?: string[];
  status: 'available' | 'sold' | 'unavailable';
  created_at: string;
  updated_at: string;
  artist?: Artist;
  category?: ProductCategory;
};

export type ProductCategory = {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
};

export type Artist = {
  id: string;
  name: string;
  specialty?: string;
  available: boolean;
  user_id?: string;
  created_at: string;
  updated_at: string;
};
