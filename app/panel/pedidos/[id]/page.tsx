import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { IconoWhatsapp } from "@/components/iconos-redes";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Volver } from "@/components/volver";
import { ApiError } from "@/lib/api/server";
import { apiFetchConSesion } from "@/lib/api/con-sesion";
import { formatearFechaHora, formatearPrecio } from "@/lib/formato";
import type { Pedido } from "@/lib/schemas/pedidos";
import { formatearTelefono } from "@/lib/schemas/telefono";
import { CambiarEstado } from "../cambiar-estado";

export const metadata: Metadata = {
  title: "Pedido",
};

export default function PedidoPage({
  params,
}: PageProps<"/panel/pedidos/[id]">) {
  return (
    <>
      <Volver href="/panel/pedidos" texto="Pedidos" />
      <Suspense fallback={<PedidoCargando />}>
        <DetallePedido params={params} />
      </Suspense>
    </>
  );
}

async function obtenerPedido(id: string): Promise<Pedido> {
  try {
    return await apiFetchConSesion(`panel/pedidos/${encodeURIComponent(id)}`);
  } catch (error) {
    // 400: id con formato inválido; 404: no existe o es de otra marca.
    if (error instanceof ApiError && [400, 404].includes(error.status)) {
      notFound();
    }
    throw error;
  }
}

async function DetallePedido({ params }: { params: Promise<{ id: string }> }) {
  const pedido = await obtenerPedido((await params).id);
  const whatsapp = `https://wa.me/${pedido.compradorTelefono}?text=${encodeURIComponent(
    `¡Hola ${pedido.compradorNombre}! Te escribo por tu pedido #${pedido.numero}.`,
  )}`;
  const envio = [
    pedido.direccion,
    [pedido.localidad, pedido.provincia].filter(Boolean).join(", "),
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Pedido #{pedido.numero}</h1>
        <p className="text-sm text-muted-foreground">
          {formatearFechaHora(pedido.creadoEn)}
        </p>
      </div>

      <CambiarEstado pedidoId={pedido.id} estado={pedido.estado} />

      <Seccion titulo="Comprador">
        <Dato>{pedido.compradorNombre}</Dato>
        <Dato>
          <a
            href={`tel:+${pedido.compradorTelefono}`}
            className="underline underline-offset-4"
          >
            {formatearTelefono(pedido.compradorTelefono)}
          </a>
        </Dato>
        {pedido.compradorDni && (
          <Dato etiqueta="DNI">{pedido.compradorDni}</Dato>
        )}
        {pedido.compradorCuit && (
          <Dato etiqueta="CUIT">{pedido.compradorCuit}</Dato>
        )}
        <Button asChild className="mt-2 self-start">
          <a href={whatsapp} target="_blank" rel="noopener noreferrer">
            <IconoWhatsapp />
            Escribirle por WhatsApp
          </a>
        </Button>
      </Seccion>

      <Seccion titulo="Entrega">
        <Dato>{pedido.entrega}</Dato>
        {envio.map((linea) => (
          <Dato key={linea}>{linea}</Dato>
        ))}
        {pedido.transporte && (
          <Dato etiqueta="Transporte">{pedido.transporte}</Dato>
        )}
        {pedido.observaciones && (
          <Dato etiqueta="Observaciones">{pedido.observaciones}</Dato>
        )}
      </Seccion>

      <Seccion titulo="Productos">
        <ul className="divide-y border-y">
          {pedido.items.map((item, i) => (
            <li key={i} className="flex justify-between gap-3 py-3 text-sm">
              <div className="min-w-0">
                {item.productoId ? (
                  <Link
                    href={`/panel/productos/${item.productoId}`}
                    className="font-semibold hover:underline"
                  >
                    {item.nombreProducto}
                  </Link>
                ) : (
                  <p className="font-semibold">{item.nombreProducto}</p>
                )}
                <p className="text-muted-foreground">
                  {item.color} / {item.talle} · {item.cantidad} ×{" "}
                  {formatearPrecio(item.precioUnitario)}
                </p>
              </div>
              <p className="shrink-0 font-bold">
                {formatearPrecio(item.cantidad * item.precioUnitario)}
              </p>
            </li>
          ))}
        </ul>
        <p className="flex justify-between pt-1 font-bold">
          <span>Total</span>
          <span className="text-lg">{formatearPrecio(pedido.total)}</span>
        </p>
      </Seccion>
    </div>
  );
}

type ConHijos = { children: React.ReactNode };

function Seccion({ titulo, children }: ConHijos & { titulo: string }) {
  return (
    <section className="flex flex-col gap-1">
      <h2 className="mb-1 text-sm font-bold uppercase">{titulo}</h2>
      {children}
    </section>
  );
}

function Dato({ etiqueta, children }: ConHijos & { etiqueta?: string }) {
  return (
    <p className="text-sm whitespace-pre-line">
      {etiqueta && <span className="text-muted-foreground">{etiqueta}: </span>}
      {children}
    </p>
  );
}

function PedidoCargando() {
  return (
    <div className="flex flex-col gap-3" aria-busy="true">
      <Skeleton className="h-7 w-40" />
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}
