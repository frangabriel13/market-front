import type { ReactNode } from "react";
import { BotonSalir } from "@/components/boton-salir";

// Barra de arriba de /panel y /admin. `children`: pestañas, si hay.
export function EncabezadoPanel({ children }: { children?: ReactNode }) {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between gap-4 px-4">
        <p className="text-sm font-extrabold tracking-[0.2em] uppercase">
          {process.env.PLATFORM_NAME}
        </p>
        <BotonSalir />
      </div>
      {children && (
        <div className="mx-auto w-full max-w-2xl px-4">{children}</div>
      )}
    </header>
  );
}
