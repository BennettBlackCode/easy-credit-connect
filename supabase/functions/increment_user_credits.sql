
CREATE OR REPLACE FUNCTION increment_user_credits(user_id UUID, amount INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE users
  SET credits = COALESCE(credits, 0) + amount
  WHERE id = user_id;
END;
$$;
