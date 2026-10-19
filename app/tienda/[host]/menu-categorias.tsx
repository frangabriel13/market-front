"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
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
import { rutaCategoria } from "./rutas";

export function MenuCategorias({ categorias }: { categorias: CategoriaTienda[] }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Categorías">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-4/5 gap-0" aria-describedby={undefined}>
        <SheetHeader className="border-b">
          <SheetTitle className="font-bold uppercase">Categorías</SheetTitle>
        </SheetHeader>
        <nav className="overflow-y-auto">
          <ul className="divide-y">
            {categorias.map((categoria) => (
              <li key={categoria.slug} className="py-2">
                <Enlace slug={categoria.slug} className="font-bold uppercase">
                  {categoria.nombre}
                </Enlace>
                {categoria.subcategorias.length > 0 && (
                  <ul>
                    {categoria.subcategorias.map((subcategoria) => (
                      <li key={subcategoria.slug}>
                        <Enlace
                          slug={subcategoria.slug}
                          className="pl-8 text-muted-foreground"
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
      </SheetContent>
    </Sheet>
  );
}

function Enlace({
  slug,
  className,
  children,
}: {
  slug: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <SheetClose asChild>
      <Link
        href={rutaCategoria(slug)}
        className={cn("block px-4 py-2.5 text-sm hover:bg-muted", className)}
      >
        {children}
      </Link>
    </SheetClose>
  );
}
