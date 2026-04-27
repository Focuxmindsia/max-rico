
-- Fix function search_path
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Tighten orders insert policy: require basic data and lock down status
DROP POLICY "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create pending orders"
  ON public.orders FOR INSERT
  WITH CHECK (
    customer_email IS NOT NULL
    AND length(customer_email) > 3
    AND delivery_method IN ('recogida', 'domicilio')
    AND status = 'pending'
  );

-- Tighten waitlist insert: require valid email
DROP POLICY "Anyone can join waitlist" ON public.waitlist_resto_espana;
CREATE POLICY "Anyone can join waitlist with valid email"
  ON public.waitlist_resto_espana FOR INSERT
  WITH CHECK (
    email IS NOT NULL
    AND length(email) > 3
    AND email LIKE '%@%'
  );
