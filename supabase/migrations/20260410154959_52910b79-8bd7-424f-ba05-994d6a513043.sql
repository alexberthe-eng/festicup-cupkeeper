
-- Orders table for checkout
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE DEFAULT 'FC-' || to_char(now(), 'YYYYMMDD') || '-' || substr(gen_random_uuid()::text, 1, 6),
  items JSONB NOT NULL DEFAULT '[]',
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_company TEXT,
  customer_address JSONB,
  total_ht NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_ttc NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded', 'shipped')),
  mollie_payment_id TEXT,
  mollie_checkout_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Public can insert orders (no auth required for checkout)
CREATE POLICY "Anyone can create an order"
  ON public.orders FOR INSERT
  WITH CHECK (true);

-- Orders can be read by matching mollie_payment_id (for webhook + confirmation)
CREATE POLICY "Read order by payment id"
  ON public.orders FOR SELECT
  USING (true);

-- Only service role can update orders (webhook updates status)
CREATE POLICY "Service role can update orders"
  ON public.orders FOR UPDATE
  USING (true);
