"use client";

import { CircleCheck } from "lucide-react";
import Link from "next/link";
import { IconoWhatsapp } from "@/components/iconos-redes";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useHidratado } from "@/hooks/use-hidratado";
import { formatearPrecio } from "@/lib/formato";
import { usePedidoArmado } from "@/lib/pedido-armado";

export function PedidoListo() {
  const pedido = usePedidoArmado();
  if (!useHidratado()) return <Skeleton className="h-60 w-full" />;

  if (!pedido) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <p className="text-sm text-muted-foreground">
          No encontramos un pedido para mostrar.
        </p>
        <Button asChild variant="outline">
          <Link href="/">Ir al inicio</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <CircleCheck className="size-12 text-success" aria-hidden="true" />
      <div>
        <h1 className="text-xl font-bold tracking-wide uppercase">
          Tu pedido está armado
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Pedido #{pedido.numero} · Total {formatearPrecio(pedido.total)}
        </p>
      </div>
      <p className="text-sm">
        Para terminar, envialo por WhatsApp. Te responden para coordinar el pago
        y la entrega.
      </p>
      <Button asChild size="lg" className="w-full">
        <a href={pedido.whatsappUrl} target="_blank" rel="noopener noreferrer">
          <IconoWhatsapp />
          Enviar por WhatsApp
        </a>
      </Button>
      <Link href="/" className="text-sm underline underline-offset-4">
        Seguir comprando
      </Link>
    </div>
  );
}
