import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckoutWizard } from "@/components/CheckoutWizard";
import type { Product } from "@/data/products";
import { AlertTriangle } from "lucide-react";

const TEST_PRODUCT: Product = {
  id: "test-1eur",
  name: "TEST PAGO REAL 1€",
  slug: "test-pago-real",
  category: "Combos",
  description: "Producto de prueba para validar el flujo de pago real con tarjeta.",
  ingredients: "-",
  preparation: "-",
  conservation: "-",
  price: 1,
  memberPrice: 1,
  image: "/placeholder.svg",
  packSize: "1 unidad",
};

export default function TestPago() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full border-2 border-yellow-400 rounded-xl p-6 bg-yellow-50">
        <div className="flex items-center gap-2 text-red-600 font-black mb-3">
          <AlertTriangle className="w-5 h-5" />
          <span>PÁGINA DE PRUEBA — NO PÚBLICA</span>
        </div>
        <h1 className="text-2xl font-black mb-2 notranslate" translate="no">
          Test de Pago Real — 1€
        </h1>
        <p className="text-black mb-4">
          Esta página crea un pedido de <strong>1,00€</strong> para verificar que
          los pagos con tarjeta real funcionan en producción. Se cobrará de
          verdad a tu tarjeta.
        </p>
        <ul className="text-sm text-black/80 mb-6 list-disc pl-5 space-y-1">
          <li>El pedido aparecerá en el panel de administración.</li>
          <li>Puedes reembolsártelo después desde el panel de Stripe.</li>
          <li>Elige "Recogida en tienda" para saltar dirección.</li>
        </ul>
        <Button
          onClick={() => setOpen(true)}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black text-lg h-12"
        >
          Pagar 1€ con tarjeta real
        </Button>
      </div>

      <CheckoutWizard
        product={TEST_PRODUCT}
        priceId="test_1eur_inline"
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}
