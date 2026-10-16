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
        Todavía no cargaste productos.
      </p>
    );
  }

  return (
    <>
      <p className="mb-3 text-sm text-muted-foreground">
        {productos.length === 1 ? "1 producto" : `${productos.length} productos`}
      </p>
      <ul className="divide-y border-y">
        {productos.map((producto) => (
          <li key={producto.id} className="flex items-center gap-3 py-3">
            <Link
              href={`/panel/productos/${producto.id}`}
              className={cn(
                "flex min-w-0 flex-1 items-center gap-3",
                !producto.visible && "opacity-50",
              )}
            >
              <Miniatura url={producto.miniatura} nombre={producto.nombre} />
              <div className="min-w-0">
                <p className="line-clamp-2 leading-snug font-semibold">
                  {producto.nombre}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {producto.categoria.nombre}
                </p>
                <p className="mt-1 font-bold">
                  {formatearPrecio(producto.precio)}
                </p>
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
    </>
  );
}

function Miniatura({ url, nombre }: { url: string | null; nombre: string }) {
  return (
    <div className="relative aspect-[3/4] w-16 shrink-0 overflow-hidden bg-muted">
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
    <ul className="divide-y border-y" aria-busy="true">
      {Array.from({ length: 4 }, (_, i) => (
        <li key={i} className="flex items-center gap-3 py-3">
          <Skeleton className="aspect-[3/4] w-16" />
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
