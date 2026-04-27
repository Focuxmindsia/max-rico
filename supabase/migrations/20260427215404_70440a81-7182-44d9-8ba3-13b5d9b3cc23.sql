
-- Orders table: store every paid order
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT UNIQUE,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  city TEXT,
  delivery_method TEXT NOT NULL CHECK (delivery_method IN ('recogida', 'domicilio')),
  scheduled_for TIMESTAMPTZ,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  amount_total_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'eur',
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  environment TEXT NOT NULL DEFAULT 'sandbox',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_email ON public.orders(customer_email);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_scheduled ON public.orders(scheduled_for);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role manages orders"
  ON public.orders FOR ALL
  USING (auth.role() = 'service_role');

-- Waitlist for "Resto de España" (clientes fuera de Zaragoza)
CREATE TABLE public.waitlist_resto_espana (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  city TEXT,
  postal_code TEXT,
  products_interested JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_waitlist_email ON public.waitlist_resto_espana(email);

ALTER TABLE public.waitlist_resto_espana ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join waitlist"
  ON public.waitlist_resto_espana FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role manages waitlist"
  ON public.waitlist_resto_espana FOR ALL
  USING (auth.role() = 'service_role');

-- Trigger to auto-update updated_at on orders
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER orders_set_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
