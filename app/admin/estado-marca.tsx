import type { EstadoMarca } from "@/lib/schemas/marcas";
import { cn } from "@/lib/utils";

const ESTADOS: Record<EstadoMarca, { texto: string; className: string }> = {
  ACTIVA: { texto: "Activa", className: "border-success text-success" },
  PAUSADA: { texto: "Pausada", className: "border-destacado text-destacado" },
  BAJA: { texto: "De baja", className: "border-border text-muted-foreground" },
};

export function EstadoMarcaBadge({ estado }: { estado: EstadoMarca }) {
  const { texto, className } = ESTADOS[estado];
  return (
    <span
      className={cn(
        "inline-block border px-1.5 py-0.5 text-[11px] font-bold tracking-wide uppercase",
        className,
      )}
    >
      {texto}
    </span>
  );
}
