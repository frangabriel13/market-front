"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { cn } from "@/lib/utils";

const SECCIONES = [
  {
    href: "/admin",
    texto: "Marcas",
    activa: (ruta: string) =>
      ruta === "/admin" || ruta.startsWith("/admin/marcas"),
  },
  {
    href: "/admin/categorias",
    texto: "Categorías",
    activa: (ruta: string) => ruta.startsWith("/admin/categorias"),
  },
];

// En las rutas con id (ej. /admin/marcas/[id]) la ruta recién se conoce al
// pedir la página: mientras tanto se muestran las pestañas sin marcar.
export function NavAdmin() {
  return (
    <Suspense fallback={<Pestanias ruta={null} />}>
      <PestaniasConRuta />
    </Suspense>
  );
}

function PestaniasConRuta() {
  return <Pestanias ruta={usePathname()} />;
}

function Pestanias({ ruta }: { ruta: string | null }) {
  return (
    <nav className="flex gap-6">
      {SECCIONES.map(({ href, texto, activa }) => {
        const actual = ruta !== null && activa(ruta);
        return (
          <Link
            key={href}
            href={href}
            aria-current={actual ? "page" : undefined}
            className={cn(
              "-mb-px border-b-2 py-3 text-sm font-medium",
              actual
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {texto}
          </Link>
        );
      })}
    </nav>
  );
}
