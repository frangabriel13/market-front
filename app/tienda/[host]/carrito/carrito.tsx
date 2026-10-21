"use client";

import { ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useHidratado } from "@/hooks/use-hidratado";
import {
  agruparPorProducto,
  totalDe,
  unidadesDe,
  useCarrito,
  type ProductoEnCarrito,
} from "@/lib/carrito";
import { formatearPrecio } from "@/lib/formato";
import { cn } from "@/lib/utils";
import { RUTA_DATOS_PEDIDO, rutaProducto } from "../rutas";

type Props = { minimoCompra: number; hayEnvio: boolean };

export function Carrito({ minimoCompra, hayEnvio }: Props) {
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
  const falta = minimoCompra - total;
  return (
    <div className="flex flex-1 flex-col gap-4">
      {minimoCompra > 0 && <AvanceMinimo total={total} minimo={minimoCompra} />}
      <ul className="divide-y border-b">
        {agruparPorProducto(items).map((producto) => (
          <Producto key={producto.productoId} producto={producto} />
        ))}
      </ul>
      <div className="flex flex-col gap-1">
        <p className="flex justify-between text-muted-foreground">
          <span>Unidades</span>
          <span>{unidadesDe(items)}</span>
        </p>
        <p className="flex items-baseline justify-between">
          <span className="text-lg font-bold">Total</span>
          <span className="text-3xl font-black">{formatearPrecio(total)}</span>
        </p>
        {hayEnvio && (
          <p className="text-sm text-muted-foreground">
            El costo de envío no está incluido.
          </p>
        )}
      </div>
      <div className="sticky bottom-0 mt-auto flex flex-col items-center gap-3 bg-background py-4">
        {falta > 0 ? (
          <Button size="lg" className="w-full" disabled>
            Continuar con el pedido
          </Button>
        ) : (
          <Button asChild size="lg" className="w-full">
            <Link href={RUTA_DATOS_PEDIDO}>Continuar con el pedido</Link>
          </Button>
        )}
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

function AvanceMinimo({ total, minimo }: { total: number; minimo: number }) {
  const falta = minimo - total;
  const avance = Math.min(100, (total / minimo) * 100);
  return (
    <div className="flex flex-col gap-3 bg-muted p-4">
      <p className="text-sm font-semibold">
        {falta > 0 ? (
          <>
            Te faltan {formatearPrecio(falta)} para la compra mínima de{" "}
            {formatearPrecio(minimo)}
          </>
        ) : (
          <>Ya superaste el mínimo de compra de {formatearPrecio(minimo)}</>
        )}
      </p>
      <div className="h-2 overflow-hidden rounded-full bg-border">
        <div
          className={cn(
            "h-full rounded-full",
            falta > 0 ? "bg-destacado" : "bg-success",
          )}
          style={{ width: `${avance}%` }}
        />
      </div>
    </div>
  );
}

function Producto({ producto }: { producto: ProductoEnCarrito }) {
  const reemplazarProducto = useCarrito(
    (carrito) => carrito.reemplazarProducto,
  );
  const unidades = unidadesDe(producto.items);
  // "Negro: S×1 · M×2", un renglón por color.
  const porColor = new Map<string, string[]>();
  for (const { color, talle, cantidad } of producto.items) {
    porColor.set(color, [...(porColor.get(color) ?? []), `${talle}×${cantidad}`]);
  }
  const href = rutaProducto(producto.productoId);
  return (
    <li className="flex gap-4 py-4">
      <Link
        href={href}
        className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden bg-muted"
      >
        {producto.miniatura ? (
          <Image
            src={producto.miniatura}
            alt={producto.nombre}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <ImageIcon className="absolute inset-0 m-auto size-5 text-muted-foreground" />
        )}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={href}
            className="line-clamp-2 font-bold uppercase hover:underline"
          >
            {producto.nombre}
          </Link>
          <span className="shrink-0 font-bold">
            {formatearPrecio(unidades * producto.precio)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {unidades} {unidades === 1 ? "unidad" : "unidades"} ·{" "}
          {formatearPrecio(producto.precio)} c/u
        </p>
        {[...porColor].map(([color, talles]) => (
          <p key={color} className="text-sm">
            {color}: {talles.join(" · ")}
          </p>
        ))}
        <div className="mt-1 flex gap-5 text-sm font-semibold">
          <Link href={href} className="underline underline-offset-4">
            Cambiar
          </Link>
          <button
            type="button"
            onClick={() => reemplazarProducto(producto.productoId, [])}
            className="underline underline-offset-4"
            aria-label={`Quitar ${producto.nombre} del pedido`}
          >
            Quitar
          </button>
        </div>
      </div>
    </li>
  );
}

export function CarritoCargando() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true">
      <Skeleton className="h-16 w-full rounded-none" />
      {Array.from({ length: 2 }, (_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="aspect-[4/5] w-24 rounded-none" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
