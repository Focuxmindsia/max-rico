-- 1) Revoke direct EXECUTE on SECURITY DEFINER function from signed-in users
REVOKE EXECUTE ON FUNCTION public.is_active_socio(uuid, text) FROM authenticated, anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_active_socio(uuid, text) TO service_role;

-- 2) Stop broadcasting all order changes over Realtime (admins get full PII stream otherwise)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'orders'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.orders';
  END IF;
END $$;

-- 3) Explicit deny-all SELECT policy on waitlist so no future permissive policy accidentally exposes PII
CREATE POLICY "Deny all client reads on waitlist"
  ON public.waitlist_resto_espana
  FOR SELECT
  TO anon, authenticated
  USING (false);