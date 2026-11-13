import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { categoriasALaVista } from "./categorias";
import { obtenerCategorias, obtenerFotoDeCategoria } from "./datos";
import { rutaCategoria } from "./rutas";

const CIRCULO = "relative block size-16 overflow-hidden rounded-full bg-muted md:size-22";

export async function CirculosCategorias({ host }: { host: string }) {
  const lista = categoriasALaVista(await obtenerCategorias(host));
  if (lista.length === 0) return null;
  const fotos = await Promise.all(
    lista.map((c) => obtenerFotoDeCategoria(host, c.slug)),
  );

  return (
    <nav
      aria-label="Categorías"
      className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none]"
    >
      <ul className="flex gap-3 md:justify-center md:gap-8">
        {lista.map((categoria, i) => (
          <li key={categoria.slug}>
            <Link
              href={rutaCategoria(categoria.slug)}
              className="group flex w-18 flex-col items-center gap-1.5 text-center text-xs font-semibold md:w-24 md:text-sm"
            >
              <span className={CIRCULO}>
                {fotos[i] ? (
                  <Image
                    src={fotos[i]}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover object-[center_20%]"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-muted-foreground uppercase">
                    {categoria.nombre.charAt(0)}
                  </span>
                )}
              </span>
              <span className="line-clamp-2 group-hover:underline">
                {categoria.nombre}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function CirculosCategoriasCargando() {
  return (
    <div className="flex gap-3 md:justify-center md:gap-8" aria-busy="true">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex w-18 flex-col items-center gap-1.5 md:w-24">
          <Skeleton className="size-16 rounded-full md:size-22" />
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
    </div>
  );
}
