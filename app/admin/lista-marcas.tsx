import { Store } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetchConSesion } from "@/lib/api/con-sesion";
import type { MarcaResumen } from "@/lib/schemas/marcas";
import { urlDeTienda } from "@/lib/url-tienda";
import { EstadoMarcaBadge } from "./estado-marca";
import { MarcaAcciones } from "./marca-acciones";

export async function ListaMarcas() {
  const marcas = await apiFetchConSesion<MarcaResumen[]>("admin/marcas");

  if (marcas.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <Store className="size-10 text-muted-foreground" strokeWidth={1.5} />
        <p className="titulo-seccion">Todavía no hay marcas</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Dala de alta con &quot;Nueva marca&quot; y después creale el acceso al
          fabricante.
        </p>
      </div>
    );
  }

  const activas = marcas.filter((m) => m.estado === "ACTIVA").length;
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">
        {marcas.length} {marcas.length === 1 ? "marca" : "marcas"} · {activas}{" "}
        {activas === 1 ? "activa" : "activas"}
      </p>
      <ul className="divide-y border-y">
        {marcas.map((marca) => (
          <li
            key={marca.id}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-x-3 gap-y-1 py-3"
          >
            <Link href={`/admin/marcas/${marca.id}`} className="group min-w-0">
              <p className="truncate font-semibold group-hover:underline">
                {marca.nombre}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {marca.dominioPropio ??
                  `${marca.slug}.${process.env.PLATFORM_DOMAIN}`}
              </p>
            </Link>
            <EstadoMarcaBadge estado={marca.estado} />
            <MarcaAcciones marca={marca} urlTienda={urlDeTienda(marca)} />
          </li>
        ))}
      </ul>
    </div>
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
