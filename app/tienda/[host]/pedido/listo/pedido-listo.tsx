"use client";

import Link from "next/link";
import { IconoWhatsapp } from "@/components/iconos-redes";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useHidratado } from "@/hooks/use-hidratado";
import { usePedidoArmado } from "@/lib/pedido-armado";

// El texto viaja en el link de WhatsApp que arma la API.
const mensajeDe = (whatsappUrl: string) =>
  new URL(whatsappUrl).searchParams.get("text") ?? "";

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
    <div className="flex flex-1 flex-col gap-5">
      <div>
        <h1 className="titulo text-3xl">Tu pedido está armado</h1>
        <p className="mt-2">
          Falta un paso: tocá el botón verde y enviá el mensaje a la marca.
        </p>
      </div>
      <section className="flex flex-col gap-2">
        <h2 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
          Mensaje que se va a enviar
        </h2>
        <p className="rounded-lg bg-muted p-4 text-sm whitespace-pre-line">
          {mensajeDe(pedido.whatsappUrl)}
        </p>
      </section>
      <div className="mt-auto flex flex-col items-center gap-3 py-4">
        <Button asChild size="lg" variant="success" className="w-full">
          <a href={pedido.whatsappUrl} target="_blank" rel="noopener noreferrer">
            <IconoWhatsapp />
            Abrir WhatsApp y enviar
          </a>
        </Button>
        <Link
          href="/"
          className="text-sm font-semibold underline underline-offset-4"
        >
          Seguir viendo productos
        </Link>
      </div>
    </div>
  );
}
