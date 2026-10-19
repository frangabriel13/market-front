"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import type { CategoriaTienda } from "@/lib/schemas/tienda";
import { cn } from "@/lib/utils";
import { rutaCategoria } from "./rutas";

type Props = { categorias: CategoriaTienda[] };

// Mientras no se conoce la ruta, se muestra sin marcar la actual.
export function BarraCategorias({ categorias }: Props) {
  return (
    <Suspense fallback={<Barra categorias={categorias} ruta={null} />}>
      <BarraConRuta categorias={categorias} />
    </Suspense>
  );
}

function BarraConRuta({ categorias }: Props) {
  return <Barra categorias={categorias} ruta={usePathname()} />;
}

function Barra({ categorias, ruta }: Props & { ruta: string | null }) {
  const enlaces = [
    { href: "/", texto: "Inicio", rutas: ["/"] },
    ...categorias.map((categoria) => ({
      href: rutaCategoria(categoria.slug),
      texto: categoria.nombre,
      // Una subcategoría marca a su categoría.
      rutas: [categoria, ...categoria.subcategorias].map((c) =>
        rutaCategoria(c.slug),
      ),
    })),
  ];
  return (
    <nav aria-label="Categorías" className="overflow-x-auto [scrollbar-width:none]">
      <ul className="flex gap-5 px-4 whitespace-nowrap">
        {enlaces.map(({ href, texto, rutas }) => {
          const actual = ruta !== null && rutas.includes(ruta);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={actual ? "page" : undefined}
                className={cn(
                  "-mb-px block border-b-2 py-2.5 text-sm",
                  actual
                    ? "border-foreground font-bold"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {texto}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
