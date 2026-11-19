"use client";

import { CircleCheck, ImageIcon, ShoppingBag, Trash2 } from "lucide-react";
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
  type ItemCarrito,
  type ProductoEnCarrito,
} from "@/lib/carrito";
import { formatearPrecio } from "@/lib/formato";
import { SIN_VALOR } from "@/lib/schemas/productos";
import { cn } from "@/lib/utils";
import { RUTA_DATOS_PEDIDO, RUTA_PRODUCTOS, rutaProducto } from "../rutas";

type Props = { minimoCompra: number; hayEnvio: boolean };

// Celular: los productos y abajo, fijo, el total con el botón. Escritorio: el
// resumen en una columna al costado.
export function Carrito({ minimoCompra, hayEnvio }: Props) {
  const items = useCarrito((carrito) => carrito.items);
  if (!useHidratado()) return <CarritoCargando />;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <ShoppingBag className="size-10 text-muted-foreground" />
        <p className="titulo-seccion">Tu pedido está vacío</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Elegí productos y cantidades, y van a aparecer acá.
        </p>
        <Button asChild className="mt-2">
          <Link href={RUTA_PRODUCTOS}>Ver productos</Link>
        </Button>
      </div>
    );
  }

  const total = totalDe(items);
  const falta = minimoCompra - total;
  const unidades = unidadesDe(items);
  return (
    <div className="flex flex-1 flex-col gap-4 md:grid md:grid-cols-[1fr_20rem] md:items-start md:gap-10">
      <div className="flex flex-col gap-4">
        {minimoCompra > 0 && (
          <AvanceMinimo total={total} minimo={minimoCompra} />
        )}
        <ul className="divide-y border-y">
          {agruparPorProducto(items).map((producto) => (
            <Producto key={producto.productoId} producto={producto} />
          ))}
        </ul>
        <Link
          href={RUTA_PRODUCTOS}
          className="self-start text-sm font-semibold underline underline-offset-4 hover:no-underline"
        >
          Seguir viendo productos
        </Link>
      </div>
      <div className="sticky bottom-0 z-10 -mx-4 mt-auto flex flex-col gap-3 border-t bg-background px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:top-24 md:bottom-auto md:mx-0 md:mt-0 md:border md:p-5">
        <p className="titulo-seccion hidden md:block">Resumen</p>
        <div className="flex flex-col gap-1 text-sm">
          <p className="flex justify-between text-muted-foreground">
            <span>Unidades</span>
            <span>{unidades}</span>
          </p>
          <p className="flex items-baseline justify-between">
            <span className="font-semibold">Total</span>
            <span className="text-2xl font-extrabold">
              {formatearPrecio(total)}
            </span>
          </p>
          {hayEnvio && (
            <p className="text-xs text-muted-foreground">
              El costo de envío no está incluido.
            </p>
          )}
        </div>
        {falta > 0 ? (
          <Button size="lg" className="w-full" disabled>
            Continuar con el pedido
          </Button>
        ) : (
          <Button asChild size="lg" className="w-full">
            <Link href={RUTA_DATOS_PEDIDO}>Continuar con el pedido</Link>
          </Button>
        )}
        {falta > 0 && (
          <p className="text-center text-xs text-muted-foreground">
            Sumá {formatearPrecio(falta)} más para continuar.
          </p>
        )}
      </div>
    </div>
  );
}

function AvanceMinimo({ total, minimo }: { total: number; minimo: number }) {
  const falta = minimo - total;
  const avance = Math.min(100, (total / minimo) * 100);
  return (
    <div className="flex flex-col gap-2.5 bg-muted p-4">
      <p className="flex items-center gap-2 text-sm font-semibold">
        {falta > 0 ? (
          <span>
            Te faltan {formatearPrecio(falta)} para la compra mínima de{" "}
            {formatearPrecio(minimo)}
          </span>
        ) : (
          <>
            <CircleCheck className="size-4 shrink-0 text-success" />
            <span>
              Ya superaste el mínimo de compra de {formatearPrecio(minimo)}
            </span>
          </>
        )}
      </p>
      <div
        role="progressbar"
        aria-label="Avance hacia la compra mínima"
        aria-valuenow={Math.round(avance)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 overflow-hidden bg-border"
      >
        <div
          className={cn(
            "h-full transition-[width] duration-300",
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
  const href = rutaProducto(producto.productoId);
  return (
    <li className="flex gap-4 py-4">
      <Link
        href={href}
        className="relative aspect-[3/4] w-20 shrink-0 overflow-hidden bg-muted md:w-24"
      >
        {producto.miniatura ? (
          <Image
            src={producto.miniatura}
            alt={producto.nombre}
            fill
            unoptimized
            loading="eager"
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
            className="line-clamp-2 text-sm font-semibold hover:underline"
          >
            {producto.nombre}
          </Link>
          <span className="shrink-0 text-sm font-bold">
            {formatearPrecio(unidades * producto.precio)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {unidades} {unidades === 1 ? "unidad" : "unidades"} ·{" "}
          {formatearPrecio(producto.precio)} c/u
        </p>
        {renglones(producto.items).map((renglon) => (
          <p key={renglon} className="text-[13px]">
            {renglon}
          </p>
        ))}
        <div className="mt-1 flex gap-5 text-[13px] font-semibold">
          <Link
            href={href}
            className="underline underline-offset-4 hover:no-underline"
          >
            Cambiar cantidades
          </Link>
          <button
            type="button"
            onClick={() => reemplazarProducto(producto.productoId, [])}
            className="flex items-center gap-1 text-muted-foreground hover:text-destructive"
            aria-label={`Quitar ${producto.nombre} del pedido`}
          >
            <Trash2 className="size-3.5" />
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
      <Skeleton className="h-16 w-full" />
      {Array.from({ length: 2 }, (_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="aspect-[3/4] w-20" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// "Negro: S×1 · M×2", un renglón por color. Sin talles, uno solo
// ("Negro×2 · Gris×1"); sin colores, sin el nombre ("S×1 · M×2"). Un producto
// sin ninguno de los dos no lleva renglones: ya se ven las unidades.
function renglones(items: ItemCarrito[]): string[] {
  if (items.every((item) => item.talle === SIN_VALOR)) {
    const conColor = items.filter((item) => item.color !== SIN_VALOR);
    return conColor.length > 0
      ? [conColor.map((item) => `${item.color}×${item.cantidad}`).join(" · ")]
      : [];
  }
  const porColor = new Map<string, string[]>();
  for (const { color, talle, cantidad } of items) {
    porColor.set(color, [
      ...(porColor.get(color) ?? []),
      `${talle}×${cantidad}`,
    ]);
  }
  return [...porColor].map(
    ([color, talles]) =>
      `${color === SIN_VALOR ? "" : `${color}: `}${talles.join(" · ")}`,
  );
}
