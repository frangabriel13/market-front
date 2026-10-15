import { Badge } from "@/components/ui/badge";
import type { EstadoMarca } from "@/lib/schemas/marcas";

const ESTADOS: Record<EstadoMarca, { texto: string; className: string }> = {
  ACTIVA: { texto: "Activa", className: "bg-success/10 text-success" },
  PAUSADA: { texto: "Pausada", className: "bg-secondary text-foreground" },
  BAJA: { texto: "De baja", className: "border-border text-muted-foreground" },
};

export function EstadoMarcaBadge({ estado }: { estado: EstadoMarca }) {
  const { texto, className } = ESTADOS[estado];
  return <Badge className={className}>{texto}</Badge>;
}
