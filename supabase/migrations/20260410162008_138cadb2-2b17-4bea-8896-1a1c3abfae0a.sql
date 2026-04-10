
CREATE OR REPLACE FUNCTION public.link_orders_to_user()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _email text;
  _uid uuid;
  _count integer;
BEGIN
  _uid := auth.uid();
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT email INTO _email FROM auth.users WHERE id = _uid;
  IF _email IS NULL THEN
    RETURN 0;
  END IF;

  UPDATE public.orders
  SET user_id = _uid
  WHERE user_id IS NULL
    AND lower(customer_email) = lower(_email);

  GET DIAGNOSTICS _count = ROW_COUNT;
  RETURN _count;
END;
$$;
