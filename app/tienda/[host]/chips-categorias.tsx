import Link from "next/link";
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
  if (chips.length === 0) return null;
  return (
    <nav
      aria-label="Categorías"
      className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none]"
    >
      <ul className="flex gap-2">
        {chips.map(({ slug, nombre }) => (
          <li key={slug}>
            <Link
              href={rutaCategoria(slug)}
              aria-current={slug === actual ? "page" : undefined}
              className={cn(
                "flex h-11 items-center border px-4 text-sm font-semibold whitespace-nowrap",
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
