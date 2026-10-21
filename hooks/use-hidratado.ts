import { useSyncExternalStore } from "react";

const sinCambios = () => () => {};

// false en el servidor y durante la hidratación: lo guardado en el navegador
// (como el carrito) se muestra recién después, sin diferencias con el HTML.
export function useHidratado() {
  return useSyncExternalStore(
    sinCambios,
    () => true,
    () => false,
  );
}
