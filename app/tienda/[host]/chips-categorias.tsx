"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { rutaCategoria } from "./rutas";

type Chip = { slug: string; nombre: string };

export function ChipsCategorias({
  chips,
  actual,
}: {
  chips: Chip[];
  actual?: string;
}) {
  const nav = useRef<HTMLElement>(null);

  // En el celular la elegida puede quedar fuera de la vista: se centra.
  useEffect(() => {
    const elegida = nav.current?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav.current || !elegida) return;
    nav.current.scrollLeft =
      elegida.offsetLeft - (nav.current.clientWidth - elegida.offsetWidth) / 2;
  }, [actual]);

  if (chips.length === 0) return null;
  return (
    <nav
      ref={nav}
      aria-label="Categorías"
      className="relative -mx-4 overflow-x-auto pl-4 [scrollbar-width:none]"
    >
      <ul className="flex w-max gap-2 pr-4">
        {chips.map(({ slug, nombre }) => (
          <li key={slug}>
            <Link
              href={rutaCategoria(slug)}
              aria-current={slug === actual ? "page" : undefined}
              className={cn(
                "flex h-9 items-center border px-3.5 text-[13px] font-semibold whitespace-nowrap transition-colors",
                slug === actual
                  ? "border-foreground bg-foreground text-background"
                  : "border-input hover:border-foreground",
              )}
            >
              {nombre}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
