
export type BlogPost = {
  id: string;
  title: string;
  content: string;
  author_id?: string;
  category_id?: string;
  tags?: string[];
  published_at?: string;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
  category?: BlogCategory;
};

export type BlogCategory = {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
};
