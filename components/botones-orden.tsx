import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  nombre: string;
  indice: number;
  total: number;
  deshabilitado?: boolean;
  onMover: (desplazamiento: -1 | 1) => void;
};

export function BotonesOrden({
  nombre,
  indice,
  total,
  deshabilitado,
  onMover,
}: Props) {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        disabled={deshabilitado || indice === 0}
        onClick={() => onMover(-1)}
        aria-label={`Subir ${nombre}`}
      >
        <ChevronUp />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        disabled={deshabilitado || indice === total - 1}
        onClick={() => onMover(1)}
        aria-label={`Bajar ${nombre}`}
      >
        <ChevronDown />
      </Button>
    </>
  );
}

// Los ids en el orden nuevo, después de mover uno de lugar.
export function idsMovidos(
  ids: string[],
  indice: number,
  desplazamiento: -1 | 1,
): string[] {
  const nuevos = [...ids];
  const destino = indice + desplazamiento;
  [nuevos[indice], nuevos[destino]] = [nuevos[destino], nuevos[indice]];
  return nuevos;
}
