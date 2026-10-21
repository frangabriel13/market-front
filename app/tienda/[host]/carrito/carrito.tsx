"use client";

import { ImageIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useHidratado } from "@/hooks/use-hidratado";
import { totalDe, unidadesDe, useCarrito, type ItemCarrito } from "@/lib/carrito";
import { formatearPrecio } from "@/lib/formato";
import { RUTA_DATOS_PEDIDO, rutaProducto } from "../rutas";
import { SelectorCantidad } from "../selector-cantidad";

export function Carrito({ minimoCompra }: { minimoCompra: number }) {
  const items = useCarrito((carrito) => carrito.items);
  if (!useHidratado()) return <CarritoCargando />;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <p className="text-sm text-muted-foreground">Tu pedido está vacío.</p>
        <Button asChild variant="outline">
          <Link href="/">Ver productos</Link>
        </Button>
      </div>
    );
  }

  const total = totalDe(items);
  const unidades = unidadesDe(items);
  const falta = minimoCompra - total;
  return (
    <>
      <ul className="divide-y border-y">
        {items.map((item) => (
          <Linea key={`${item.productoId}|${item.color}|${item.talle}`} item={item} />
        ))}
      </ul>
      <div className="sticky bottom-0 flex flex-col gap-3 border-t bg-background py-4">
        <p className="flex items-baseline justify-between">
          <span className="text-sm">
            Total ({unidades} {unidades === 1 ? "unidad" : "unidades"})
          </span>
          <span className="text-xl font-bold">{formatearPrecio(total)}</span>
        </p>
        {falta > 0 && (
          <p className="text-sm">
            Te faltan <strong>{formatearPrecio(falta)}</strong> para llegar a la
            compra mínima de {formatearPrecio(minimoCompra)}.
          </p>
        )}
        {falta > 0 ? (
          <Button size="lg" disabled>
            Continuar
          </Button>
        ) : (
          <Button asChild size="lg">
            <Link href={RUTA_DATOS_PEDIDO}>Continuar</Link>
          </Button>
        )}
      </div>
    </>
  );
}

function Linea({ item }: { item: ItemCarrito }) {
  const cambiarCantidad = useCarrito((carrito) => carrito.cambiarCantidad);
  const quitar = useCarrito((carrito) => carrito.quitar);
  const variante = `${item.color} / ${item.talle}`;
  return (
    <li className="flex gap-3 py-4">
      <Link
        href={rutaProducto(item.productoId)}
        className="relative aspect-[3/4] w-20 shrink-0 overflow-hidden bg-muted"
      >
        {item.miniatura ? (
          <Image src={item.miniatura} alt={item.nombre} fill unoptimized className="object-cover" />
        ) : (
          <ImageIcon className="absolute inset-0 m-auto size-5 text-muted-foreground" />
        )}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={rutaProducto(item.productoId)}
            className="line-clamp-2 text-sm leading-snug hover:underline"
          >
            {item.nombre}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="-mt-2 -mr-2 shrink-0"
            aria-label={`Quitar ${item.nombre} (${variante})`}
            onClick={() => quitar(item)}
          >
            <Trash2 />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {variante} · {formatearPrecio(item.precio)} c/u
        </p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <SelectorCantidad
            valor={item.cantidad}
            onChange={(cantidad) => cambiarCantidad(item, cantidad)}
          />
          <span className="font-bold">
            {formatearPrecio(item.precio * item.cantidad)}
          </span>
        </div>
      </div>
    </li>
  );
}

export function CarritoCargando() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true">
      {Array.from({ length: 2 }, (_, i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="aspect-[3/4] w-20 rounded-none" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
