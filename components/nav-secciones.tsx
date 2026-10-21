"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { cn } from "@/lib/utils";

// Activa en `href` y en las rutas que empiezan con `incluye` (por defecto, las
// que cuelgan de `href`).
export type Seccion = { href: string; texto: string; incluye?: string[] };

type Props = { secciones: Seccion[] };

// En las rutas con id (ej. /admin/marcas/[id]) la ruta recién se conoce al
// pedir la página: mientras tanto se muestran las pestañas sin marcar.
export function NavSecciones({ secciones }: Props) {
  return (
    <Suspense fallback={<Pestanias secciones={secciones} ruta={null} />}>
      <PestaniasConRuta secciones={secciones} />
    </Suspense>
  );
}

function PestaniasConRuta({ secciones }: Props) {
  return <Pestanias secciones={secciones} ruta={usePathname()} />;
}

const esActiva = (ruta: string, { href, incluye = [`${href}/`] }: Seccion) =>
  ruta === href || incluye.some((prefijo) => ruta.startsWith(prefijo));

function Pestanias({ secciones, ruta }: Props & { ruta: string | null }) {
  return (
    <nav className="flex gap-6">
      {secciones.map((seccion) => {
        const actual = ruta !== null && esActiva(ruta, seccion);
        return (
          <Link
            key={seccion.href}
            href={seccion.href}
            aria-current={actual ? "page" : undefined}
            className={cn(
              "-mb-px border-b-2 py-3 text-sm font-medium",
              actual
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {seccion.texto}
          </Link>
        );
      })}
    </nav>
  );
}
