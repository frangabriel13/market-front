import {
  ETIQUETAS_ESTADO_PEDIDO,
  type EstadoPedido,
} from "@/lib/schemas/pedidos";
import { cn } from "@/lib/utils";

export const ESTILOS_ESTADO: Record<EstadoPedido, string> = {
  NUEVO: "border-foreground bg-foreground text-background",
  PAGADO: "border-success text-success",
  EN_PREPARACION: "border-foreground",
  ENTREGADO: "border-border text-muted-foreground",
  CANCELADO: "border-border text-muted-foreground line-through",
};

export function EstadoPedidoEtiqueta({ estado }: { estado: EstadoPedido }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 shrink-0 items-center border px-1.5 text-[11px] font-bold tracking-wider whitespace-nowrap uppercase",
        ESTILOS_ESTADO[estado],
      )}
    >
      {ETIQUETAS_ESTADO_PEDIDO[estado]}
    </span>
  );
}
