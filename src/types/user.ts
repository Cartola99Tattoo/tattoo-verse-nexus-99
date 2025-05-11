
export type User = {
  id: string;
  email?: string;
  created_at: string;
  profile?: UserProfile;
};

export type UserProfile = {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role?: string;
  created_at: string;
  updated_at: string;
};
