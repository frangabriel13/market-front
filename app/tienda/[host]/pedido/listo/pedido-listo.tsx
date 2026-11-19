"use client";

import { CircleCheck } from "lucide-react";
import Link from "next/link";
import { IconoWhatsapp } from "@/components/iconos-redes";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useHidratado } from "@/hooks/use-hidratado";
import { formatearPrecio } from "@/lib/formato";
import { usePedidoArmado } from "@/lib/pedido-armado";
import { RUTA_PRODUCTOS } from "../../rutas";

// El texto viaja en el link de WhatsApp que arma la API.
const mensajeDe = (whatsappUrl: string) =>
  new URL(whatsappUrl).searchParams.get("text") ?? "";

export function PedidoListo() {
  const pedido = usePedidoArmado();
  if (!useHidratado()) return <Skeleton className="h-60 w-full" />;

  if (!pedido) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="titulo-seccion">No encontramos un pedido para mostrar</p>
        <Button asChild>
          <Link href="/">Ir al inicio</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <CircleCheck className="size-11 text-success" strokeWidth={1.5} />
        <p className="text-sm text-muted-foreground">
          Pedido #{pedido.numero} · {formatearPrecio(pedido.total)}
        </p>
        <h1 className="titulo">Tu pedido está armado</h1>
        <p className="max-w-sm text-sm">
          Falta un paso: tocá el botón verde y enviá el mensaje por WhatsApp a
          la marca. Ahí coordinan el pago y la entrega.
        </p>
      </div>
      <section className="flex flex-col gap-2">
        <h2 className="titulo-seccion">Mensaje que se va a enviar</h2>
        <p className="border-l-2 border-success bg-muted p-4 text-[13px] leading-relaxed whitespace-pre-line">
          {mensajeDe(pedido.whatsappUrl)}
        </p>
      </section>
      {/* En el celular el botón queda abajo, a mano. */}
      <div className="sticky bottom-0 z-10 -mx-4 mt-auto flex flex-col items-center gap-3 border-t bg-background px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:static md:mx-0 md:border-0 md:px-0">
        <Button
          asChild
          size="lg"
          variant="success"
          className="h-auto min-h-12 w-full py-3 whitespace-normal"
        >
          <a href={pedido.whatsappUrl} target="_blank" rel="noopener noreferrer">
            <IconoWhatsapp />
            Abrir WhatsApp y enviar
          </a>
        </Button>
        <Link
          href={RUTA_PRODUCTOS}
          className="text-sm font-semibold underline underline-offset-4 hover:no-underline"
        >
          Seguir viendo productos
        </Link>
      </div>
    </div>
  );
}
