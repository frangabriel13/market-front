import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetchConSesion } from "@/lib/api/con-sesion";
import type { MarcaResumen } from "@/lib/schemas/marcas";
import { EstadoMarcaBadge } from "./estado-marca";
import { MarcaAcciones } from "./marca-acciones";

export async function ListaMarcas() {
  const marcas = await apiFetchConSesion<MarcaResumen[]>("admin/marcas");

  if (marcas.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Todavía no hay marcas.
      </p>
    );
  }

  return (
    <ul className="divide-y border-y">
      {marcas.map((marca) => (
        <li
          key={marca.id}
          className="grid grid-cols-[1fr_auto_auto] items-center gap-x-3 gap-y-1 py-3"
        >
          <Link href={`/admin/marcas/${marca.id}`} className="min-w-0">
            <p className="truncate font-semibold">{marca.nombre}</p>
            <p className="truncate text-sm text-muted-foreground">
              {marca.dominioPropio ??
                `${marca.slug}.${process.env.PLATFORM_DOMAIN}`}
            </p>
          </Link>
          <EstadoMarcaBadge estado={marca.estado} />
          <MarcaAcciones marca={marca} />
        </li>
      ))}
    </ul>
  );
}

export function ListaMarcasCargando() {
  return (
    <ul className="divide-y border-y" aria-busy="true">
      {Array.from({ length: 4 }, (_, i) => (
        <li key={i} className="flex items-center gap-3 py-3">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3.5 w-44" />
          </div>
          <Skeleton className="h-5 w-14" />
        </li>
      ))}
    </ul>
  );
}
