import { ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { formatearPrecio } from "@/lib/formato";
import type { ProductoTiendaResumen } from "@/lib/schemas/tienda";
import { rutaProducto } from "./rutas";

const GRILLA = "grid grid-cols-2 gap-x-2 gap-y-5 sm:grid-cols-3 lg:grid-cols-4";

export function GrillaProductos({
  productos,
}: {
  productos: ProductoTiendaResumen[];
}) {
  return (
    <ul className={GRILLA}>
      {productos.map((producto) => (
        <li key={producto.id}>
          <TarjetaProducto producto={producto} />
        </li>
      ))}
    </ul>
  );
}

function TarjetaProducto({ producto }: { producto: ProductoTiendaResumen }) {
  return (
    <Link href={rutaProducto(producto.id)} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        {producto.miniatura ? (
          <Image
            src={producto.miniatura}
            alt={producto.nombre}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <ImageIcon className="absolute inset-0 m-auto size-6 text-muted-foreground" />
        )}
        {producto.agotado && (
          <span className="absolute inset-x-0 bottom-0 bg-foreground/80 py-1.5 text-center text-xs font-bold tracking-wide text-background uppercase">
            Agotado
          </span>
        )}
      </div>
      <p className="mt-2 line-clamp-2 text-sm leading-snug group-hover:underline">
        {producto.nombre}
      </p>
      <p className="mt-0.5 font-bold">{formatearPrecio(producto.precio)}</p>
    </Link>
  );
}

export function GrillaProductosCargando() {
  return (
    <ul className={GRILLA} aria-busy="true">
      {Array.from({ length: 4 }, (_, i) => (
        <li key={i}>
          <Skeleton className="aspect-[3/4] rounded-none" />
          <Skeleton className="mt-2 h-4 w-3/4" />
          <Skeleton className="mt-1 h-4 w-1/3" />
        </li>
      ))}
    </ul>
  );
}
