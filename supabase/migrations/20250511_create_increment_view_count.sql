
-- Create a new stored procedure for incrementing the view count
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;
