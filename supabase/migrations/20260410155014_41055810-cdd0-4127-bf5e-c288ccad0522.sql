
-- Drop overly permissive policies
DROP POLICY IF EXISTS "Anyone can create an order" ON public.orders;
DROP POLICY IF EXISTS "Service role can update orders" ON public.orders;

-- Only allow inserting with pending status
CREATE POLICY "Public can create pending orders"
  ON public.orders FOR INSERT
  WITH CHECK (status = 'pending');

-- Updates only via service role (edge functions use service role key)
CREATE POLICY "Service role updates orders"
  ON public.orders FOR UPDATE
  USING (auth.role() = 'service_role');
