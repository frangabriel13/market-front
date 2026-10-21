import { useMemo, useSyncExternalStore } from "react";
import type { PedidoCreado } from "@/lib/schemas/pedidos";

// El último pedido creado en esta pestaña: la confirmación lo sigue mostrando
// si se recarga la página antes de abrir WhatsApp.
const CLAVE = "pedido-armado";

export function guardarPedidoArmado(pedido: PedidoCreado) {
  try {
    sessionStorage.setItem(CLAVE, JSON.stringify(pedido));
  } catch {
    // Sin almacenamiento (ej. modo privado): la confirmación avisa que no lo encuentra.
  }
}

const sinCambios = () => () => {};

function leer(): string | null {
  try {
    return sessionStorage.getItem(CLAVE);
  } catch {
    return null;
  }
}

export function usePedidoArmado(): PedidoCreado | null {
  const crudo = useSyncExternalStore(sinCambios, leer, () => null);
  return useMemo(() => (crudo ? (JSON.parse(crudo) as PedidoCreado) : null), [crudo]);
}
