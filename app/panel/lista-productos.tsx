import { ImageIcon, Shirt } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetchConSesion } from "@/lib/api/con-sesion";
import { formatearPrecio } from "@/lib/formato";
import type { ProductoResumen } from "@/lib/schemas/productos";
import { cn } from "@/lib/utils";
import { InterruptorVisible } from "./interruptor-visible";

export async function ListaProductos() {
  const productos =
    await apiFetchConSesion<ProductoResumen[]>("panel/productos");

  if (productos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <Shirt className="size-10 text-muted-foreground" strokeWidth={1.5} />
        <p className="titulo-seccion">Todavía no cargaste productos</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Empezá con &quot;Cargar producto nuevo&quot;. Podés guardarlo sin
          publicar y terminarlo después.
        </p>
      </div>
    );
  }

  const ocultos = productos.filter((p) => !p.visible).length;
  return (
    <section className="flex flex-col gap-2.5">
      <p className="text-sm text-muted-foreground">
        {productos.length} {productos.length === 1 ? "producto" : "productos"}
        {ocultos > 0 && ` · ${ocultos} ${ocultos === 1 ? "oculto" : "ocultos"}`}
      </p>
      <ul className="flex flex-col gap-2">
        {productos.map((producto) => (
          <li
            key={producto.id}
            className="flex items-center gap-3 border bg-background p-3 transition-colors hover:border-foreground/30"
          >
            <Link
              href={`/panel/productos/${producto.id}`}
              className="flex min-w-0 flex-1 items-center gap-3"
            >
              <Miniatura
                url={producto.miniatura}
                nombre={producto.nombre}
                apagada={!producto.visible}
              />
              <div
                className={cn(
                  "flex min-w-0 flex-col gap-0.5",
                  !producto.visible && "text-muted-foreground",
                )}
              >
                <p className="line-clamp-2 leading-snug font-semibold">
                  {producto.nombre}
                </p>
                <p className="truncate text-sm">
                  <span className="font-semibold">
                    {formatearPrecio(producto.precio)}
                  </span>{" "}
                  · {producto.categoria.nombre}
                </p>
                <Disponibilidad producto={producto} />
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
    </section>
  );
}

function Disponibilidad({
  producto: { combinaciones, agotadas },
}: {
  producto: ProductoResumen;
}) {
  if (combinaciones === 0) {
    return (
      <p className="text-xs text-destructive">Sin disponibilidad marcada</p>
    );
  }
  if (agotadas === combinaciones) {
    return (
      <Badge variant="destructive" className="mt-0.5">
        Todo agotado
      </Badge>
    );
  }
  return (
    <p className="text-xs text-muted-foreground">
      {combinaciones} {combinaciones === 1 ? "combinación" : "combinaciones"}
      {agotadas > 0 &&
        ` · ${agotadas} ${agotadas === 1 ? "agotada" : "agotadas"}`}
    </p>
  );
}

function Miniatura({
  url,
  nombre,
  apagada,
}: {
  url: string | null;
  nombre: string;
  apagada: boolean;
}) {
  return (
    <div className="relative aspect-[3/4] w-16 shrink-0 overflow-hidden bg-muted">
      {url ? (
        <Image
          src={url}
          alt={nombre}
          fill
          unoptimized
          className={cn("object-cover", apagada && "opacity-50")}
        />
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
        <li
          key={i}
          className="flex items-center gap-3 border bg-background p-3"
        >
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
