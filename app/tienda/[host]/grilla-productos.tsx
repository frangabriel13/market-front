import { ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatearPrecio } from "@/lib/formato";
import type { ProductoTiendaResumen } from "@/lib/schemas/tienda";
import { cn } from "@/lib/utils";
import { RUTA_PRODUCTOS, rutaProducto } from "./rutas";

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
      {productos.map((producto, i) => (
        <li key={producto.id}>
          <TarjetaProducto producto={producto} arriba={i < 4} />
        </li>
      ))}
    </ul>
  );
}

// `arriba`: se ve sin bajar, así que la foto carga primero.
function TarjetaProducto({
  producto,
  arriba,
}: {
  producto: ProductoTiendaResumen;
  arriba: boolean;
}) {
  return (
    <Link href={rutaProducto(producto.id)} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        {producto.miniatura ? (
          <Image
            src={producto.miniatura}
            alt={producto.nombre}
            fill
            unoptimized
            loading={arriba ? "eager" : "lazy"}
            className={cn(
              "object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.03]",
              producto.agotado && "opacity-60",
            )}
          />
        ) : (
          <ImageIcon className="absolute inset-0 m-auto size-6 text-muted-foreground" />
        )}
        {producto.agotado && (
          <Badge className="absolute top-2 left-2">Agotado</Badge>
        )}
      </div>
      <div className={cn("mt-1.5", producto.agotado && "text-muted-foreground")}>
        <p className="truncate text-[13px] text-foreground/80 group-hover:underline md:text-sm">
          {producto.nombre}
        </p>
        <p className="text-[15px] font-extrabold md:text-base">
          {formatearPrecio(producto.precio)}
        </p>
      </div>
    </Link>
  );
}

// Título del listado con la cantidad de productos al lado.
export function TituloListado({
  titulo,
  cantidad,
}: {
  titulo: string;
  cantidad?: number;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h1 className="titulo">{titulo}</h1>
      {cantidad !== undefined && cantidad > 0 && (
        <p className="shrink-0 text-sm text-muted-foreground">
          {cantidad} {cantidad === 1 ? "producto" : "productos"}
        </p>
      )}
    </div>
  );
}

// `conLinkATodos`: en una categoría, para seguir mirando el resto.
export function SinProductos({ conLinkATodos }: { conLinkATodos?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <p className="titulo-seccion">Todavía no hay productos acá</p>
      {conLinkATodos && (
        <Link
          href={RUTA_PRODUCTOS}
          className="text-sm font-semibold underline underline-offset-4 hover:no-underline"
        >
          Ver todos los productos
        </Link>
      )}
    </div>
  );
}

export function GrillaProductosCargando() {
  return (
    <ul className={GRILLA} aria-busy="true">
      {Array.from({ length: 8 }, (_, i) => (
        <li key={i}>
          <Skeleton className="aspect-[3/4]" />
          <Skeleton className="mt-2 h-4 w-3/4" />
          <Skeleton className="mt-1 h-4 w-1/3" />
        </li>
      ))}
    </ul>
  );
}
