import Image from "next/image";
import { cn } from "@/lib/utils";

// Captura de 375 × 760 dentro de un marco de teléfono.
export function Celular({
  src,
  alt,
  className,
  prioridad,
}: {
  src: string;
  alt: string;
  className?: string;
  prioridad?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto aspect-[375/760] w-full max-w-60 overflow-hidden rounded-[2rem] border-[6px] border-foreground bg-foreground shadow-xl",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="240px"
        preload={prioridad}
        // Son pocas y se ven enseguida en escritorio: sin carga diferida.
        loading={prioridad ? undefined : "eager"}
        className="object-cover object-top"
      />
    </div>
  );
}
