"use client";

import { ChevronRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { CategoriaTienda } from "@/lib/schemas/tienda";
import { cn } from "@/lib/utils";
import { RUTA_PRODUCTOS, rutaCategoria } from "./rutas";

type Props = { categorias: CategoriaTienda[] };

export function MenuCategorias({ categorias }: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Categorías">
          <Menu className="size-5.5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="gap-0" aria-describedby={undefined}>
        <SheetHeader>
          <SheetTitle>Categorías</SheetTitle>
        </SheetHeader>
        <ListaCategorias categorias={categorias} />
      </SheetContent>
    </Sheet>
  );
}

// Aparte del botón: la ruta se lee recién al abrir el menú (el botón también
// se muestra mientras carga, cuando todavía no se conoce).
function ListaCategorias({ categorias }: Props) {
  const ruta = usePathname();
  return (
    <nav className="overflow-y-auto">
      <ul className="divide-y">
        <li>
          <Enlace
            href={RUTA_PRODUCTOS}
            ruta={ruta}
            className="font-bold uppercase"
          >
            Todos los productos
          </Enlace>
        </li>
        {categorias.map((categoria) => (
          <li key={categoria.slug}>
            <Enlace
              href={rutaCategoria(categoria.slug)}
              ruta={ruta}
              className="font-bold uppercase"
            >
              {categoria.nombre}
            </Enlace>
            {categoria.subcategorias.length > 0 && (
              <ul className="pb-2">
                {categoria.subcategorias.map((subcategoria) => (
                  <li key={subcategoria.slug}>
                    <Enlace
                      href={rutaCategoria(subcategoria.slug)}
                      ruta={ruta}
                      className="py-2.5 pl-8"
                    >
                      {subcategoria.nombre}
                    </Enlace>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Enlace({
  href,
  ruta,
  className,
  children,
}: {
  href: string;
  ruta: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <SheetClose asChild>
      <Link
        href={href}
        aria-current={ruta === href ? "page" : undefined}
        className={cn(
          "flex items-center justify-between gap-2 px-4 py-3.5 text-sm hover:bg-muted aria-[current=page]:bg-muted",
          className,
        )}
      >
        {children}
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      </Link>
    </SheetClose>
  );
}
