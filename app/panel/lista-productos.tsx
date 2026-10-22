import { ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetchConSesion } from "@/lib/api/con-sesion";
import { formatearPrecio } from "@/lib/formato";
import type { ProductoResumen } from "@/lib/schemas/productos";
import { cn } from "@/lib/utils";
import { InterruptorVisible } from "./interruptor-visible";

export async function ListaProductos() {
  const productos = await apiFetchConSesion<ProductoResumen[]>("panel/productos");

  if (productos.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Todavía no cargaste productos. Empezá con el botón de arriba.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {productos.map((producto) => (
        <li
          key={producto.id}
          className="flex items-center gap-3 border bg-background p-3"
        >
          <Link
            href={`/panel/productos/${producto.id}`}
            className="flex min-w-0 flex-1 items-center gap-3"
          >
            <Miniatura url={producto.miniatura} nombre={producto.nombre} />
            <div
              className={cn(
                "min-w-0",
                !producto.visible && "text-muted-foreground",
              )}
            >
              <p className="line-clamp-2 leading-snug font-bold">
                {producto.nombre}
              </p>
              <p className="truncate text-sm">
                {formatearPrecio(producto.precio)} · {producto.categoria.nombre}
              </p>
              <Disponibilidad producto={producto} />
              {!producto.visible && (
                <p className="text-sm">Oculto: no se ve en la tienda</p>
              )}
            </div>
          </Link>
          <InterruptorVisible
            productoId={producto.id}
            nombre={producto.nombre}
            visible={producto.visible}
          />
        </li>
      ))}
    </ul>
  );
}

function Disponibilidad({
  producto: { combinaciones, agotadas },
}: {
  producto: ProductoResumen;
}) {
  if (combinaciones === 0) {
    return <p className="text-sm text-destructive">Sin colores ni talles</p>;
  }
  if (agotadas === combinaciones) {
    return <p className="text-sm font-bold text-destructive">Todo agotado</p>;
  }
  return (
    <p className="text-sm text-muted-foreground">
      {combinaciones} {combinaciones === 1 ? "combinación" : "combinaciones"}
      {agotadas > 0 &&
        ` · ${agotadas} ${agotadas === 1 ? "agotada" : "agotadas"}`}
    </p>
  );
}

function Miniatura({ url, nombre }: { url: string | null; nombre: string }) {
  return (
    <div className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden bg-muted">
      {url ? (
        <Image src={url} alt={nombre} fill unoptimized className="object-cover" />
      ) : (
        <ImageIcon className="absolute inset-0 m-auto size-5 text-muted-foreground" />
      )}
    </div>
  );
}

export function ListaProductosCargando() {
  return (
    <ul className="flex flex-col gap-3" aria-busy="true">
      {Array.from({ length: 4 }, (_, i) => (
        <li key={i} className="flex items-center gap-3 border bg-background p-3">
          <Skeleton className="aspect-[4/5] w-16 rounded-none" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </li>
      ))}
    </ul>
  );
}
