const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN as string | undefined;

export function PaymentTestModeBanner() {
  if (!clientToken?.startsWith("pk_test_")) return null;
  return (
    <div className="w-full bg-orange-100 border-b border-orange-300 px-4 py-2 text-center text-sm text-orange-800">
      🧪 Modo de prueba: los pagos en la vista previa no son reales. Usa la tarjeta{" "}
      <span className="font-mono font-semibold">4242 4242 4242 4242</span>.
    </div>
  );
}
