"use client";

import { useLayoutEffect, useState, useTransition } from "react";

type Accion = () => Promise<{ error: string } | undefined>;

// Corre una Server Action con estado de carga y guarda su error, si lo hay.
export function useAccion() {
  const [pendiente, startTransition] = useTransition();
  const [error, setError] = useState<string>();

  // Que un error viejo no aparezca al volver a la página.
  useLayoutEffect(() => () => setError(undefined), []);

  function ejecutar(accion: Accion) {
    setError(undefined);
    startTransition(async () => {
      const resultado = await accion();
      if (resultado) setError(resultado.error);
    });
  }

  return { pendiente, error, ejecutar };
}
