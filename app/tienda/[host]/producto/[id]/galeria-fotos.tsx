"use client";

import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import type { ProductoTienda } from "@/lib/schemas/tienda";
import { cn } from "@/lib/utils";

type Props = { fotos: ProductoTienda["fotos"]; nombre: string };

export function GaleriaFotos({ fotos, nombre }: Props) {
  const [actual, setActual] = useState(0);
  const lista = useRef<HTMLUListElement>(null);

  if (fotos.length === 0) {
    return (
      <div className="relative aspect-[3/4] bg-muted">
        <ImageIcon className="absolute inset-0 m-auto size-8 text-muted-foreground" />
      </div>
    );
  }

  function irA(indice: number) {
    const el = lista.current;
    el?.scrollTo({ left: indice * el.clientWidth, behavior: "smooth" });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <ul
          ref={lista}
          className="flex aspect-[3/4] snap-x snap-mandatory overflow-x-auto bg-muted [scrollbar-width:none]"
          onScroll={(e) => {
            const { scrollLeft, clientWidth } = e.currentTarget;
            setActual(Math.round(scrollLeft / clientWidth));
          }}
        >
          {fotos.map((foto, i) => (
            <li key={foto.url} className="relative w-full shrink-0 snap-center">
              <Image
                src={foto.url}
                alt={`${nombre}, foto ${i + 1} de ${fotos.length}`}
                fill
                unoptimized
                preload={i === 0}
                loading={i === 0 ? undefined : "lazy"}
                className="object-cover"
              />
            </li>
          ))}
        </ul>
        {fotos.length > 1 && (
          <span
            aria-hidden="true"
            className="absolute right-3 bottom-3 rounded-full bg-foreground/75 px-2.5 py-1 text-xs font-semibold text-background tabular-nums"
          >
            {actual + 1} / {fotos.length}
          </span>
        )}
      </div>
      {fotos.length > 1 && (
        <ul className="flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] md:px-0">
          {fotos.map((foto, i) => (
            <li key={foto.url} className="w-14 shrink-0 md:w-16">
              <button
                type="button"
                onClick={() => irA(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === actual}
                className={cn(
                  "relative block aspect-[3/4] w-full overflow-hidden bg-muted after:pointer-events-none after:absolute after:inset-0 after:z-10",
                  i === actual
                    ? "after:border-2 after:border-foreground"
                    : "after:border after:border-border hover:after:border-foreground/40",
                )}
              >
                <Image
                  src={foto.urlMiniatura}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
