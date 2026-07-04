CREATE POLICY "Admins can read orders" ON public.orders
FOR SELECT TO authenticated
USING (
  (auth.jwt() ->> 'email') IN (
    'clientes@maxrico.es','maxrico@maxrico.es',
    'alvarodavid3062@gmail.com','exododigital21@gmail.com'
  )
);