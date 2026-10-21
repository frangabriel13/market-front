import type { ReactNode } from "react";
import { MarcaPlataforma } from "@/components/marca-plataforma";

type Props = { titulo: string; descripcion?: ReactNode; children: ReactNode };

export function PantallaAuth({ titulo, descripcion, children }: Props) {
  return (
    <>
      <MarcaPlataforma />
      <main className="flex flex-1 flex-col items-center px-4 py-10 sm:justify-center">
        <div className="w-full max-w-sm">
          <h1 className="titulo text-3xl">{titulo}</h1>
          {descripcion && (
            <p className="mt-2 text-sm text-muted-foreground">{descripcion}</p>
          )}
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </>
  );
}
