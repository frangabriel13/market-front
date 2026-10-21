import type { ReactNode } from "react";
import { BotonSalir } from "@/components/boton-salir";
import { MarcaPlataforma } from "@/components/marca-plataforma";

// Barra de arriba del panel de administración. `children`: pestañas.
export function EncabezadoPanel({ children }: { children?: ReactNode }) {
  return (
    <header className="border-b bg-background">
      <MarcaPlataforma>
        <BotonSalir sobreOscuro />
      </MarcaPlataforma>
      {children && (
        <div className="mx-auto w-full max-w-2xl overflow-x-auto px-4 [scrollbar-width:none]">
          {children}
        </div>
      )}
    </header>
  );
}
