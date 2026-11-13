import { ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { formatearPrecio } from "@/lib/formato";
import type { ProductoTiendaResumen } from "@/lib/schemas/tienda";
import { cn } from "@/lib/utils";
import { rutaProducto } from "./rutas";

// Grilla densa (estilo de la 7.1): 2 columnas en el celular.
const GRILLA =
  "grid grid-cols-2 gap-x-2 gap-y-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";

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
          <span className="absolute top-2 left-2 bg-foreground px-2 py-1 text-xs font-bold tracking-wide text-background uppercase">
            Agotado
          </span>
        )}
      </div>
      <div className={cn("mt-1.5", producto.agotado && "text-muted-foreground")}>
        <p className="truncate text-[13px] text-foreground/80 group-hover:underline">
          {producto.nombre}
        </p>
        <p className="text-[15px] font-extrabold">
          {formatearPrecio(producto.precio)}
        </p>
      </div>
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
