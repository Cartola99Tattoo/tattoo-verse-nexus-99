
export interface BlogPost {
  id: string;
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  author_id?: string;
  category_id?: string;
  tags?: string[];
  published_at?: string;
  is_draft?: boolean;
  reading_time?: number;
  meta_description?: string;
  meta_keywords?: string;
  view_count?: number;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
  category?: BlogCategory;
}

export interface BlogCategory {
  id: string;
  name: string;
  description?: string;
  slug?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogComment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id?: string;
  content: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
  replies?: BlogComment[];
}
