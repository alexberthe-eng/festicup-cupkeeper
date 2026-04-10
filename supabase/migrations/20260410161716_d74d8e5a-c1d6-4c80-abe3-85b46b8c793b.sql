
ALTER TABLE public.orders ADD COLUMN prestashop_order_id integer UNIQUE;

CREATE INDEX idx_orders_prestashop_id ON public.orders (prestashop_order_id) WHERE prestashop_order_id IS NOT NULL;
