"use client";

import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { ProductoTienda } from "@/lib/schemas/tienda";

type Props = { fotos: ProductoTienda["fotos"]; nombre: string };

export function GaleriaFotos({ fotos, nombre }: Props) {
  const [actual, setActual] = useState(0);

  if (fotos.length === 0) {
    return (
      <div className="relative aspect-[3/4] bg-muted">
        <ImageIcon className="absolute inset-0 m-auto size-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="relative">
      <ul
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
              priority={i === 0}
              loading={i === 0 ? undefined : "lazy"}
              className="object-cover"
            />
          </li>
        ))}
      </ul>
      {fotos.length > 1 && (
        <p
          aria-hidden="true"
          className="absolute right-3 bottom-3 bg-foreground/70 px-2 py-0.5 text-xs font-bold text-background"
        >
          {actual + 1} / {fotos.length}
        </p>
      )}
    </div>
  );
}
