
// Blog related types
export interface BlogCategory {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogAuthor {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  role?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string | null;
  content: string;
  excerpt: string | null;
  cover_image: string | null;
  author_id: string | null;
  category_id: string | null;
  tags: string[];
  view_count: number;
  reading_time: number | null;
  is_draft: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  meta_description: string | null;
  meta_keywords: string | null;
  
  // Joined relations
  profiles?: BlogAuthor | null;
  blog_categories?: BlogCategory | null;
}

export interface BlogComment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  
  // Joined relations
  profiles?: BlogAuthor | null;
  replies?: BlogComment[];
}

// Filter and query related types
export interface BlogFiltersState {
  search?: string;
  status?: 'all' | 'published' | 'draft' | 'scheduled';
  category?: string;
  author?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  sortBy?: string;
}
