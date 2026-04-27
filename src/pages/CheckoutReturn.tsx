import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutReturn() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full text-center space-y-6 bg-white rounded-2xl shadow-lg p-8 border">
        <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto" />
        <h1 className="text-3xl font-black text-foreground">¡Pago recibido!</h1>
        <p className="text-muted-foreground">
          Gracias por tu compra en <span translate="no" className="notranslate font-bold">MaxRico</span>. Te enviaremos los detalles por email y coordinamos la entrega contigo por WhatsApp.
        </p>
        {sessionId && (
          <p className="text-xs text-muted-foreground font-mono break-all">
            Ref: {sessionId}
          </p>
        )}
        <div className="flex flex-col gap-2">
          <Button asChild className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold">
            <Link to="/catalogo">Seguir comprando</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Ir al inicio</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
