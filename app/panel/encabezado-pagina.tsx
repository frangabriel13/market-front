import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  titulo: string;
  // Con `volver`, flecha atrás en lugar del "Panel de tu marca".
  volver?: string;
  accion?: ReactNode;
};

export function EncabezadoPagina({ titulo, volver, accion }: Props) {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex w-full max-w-2xl items-center gap-3 px-4 py-3">
        {volver && (
          <Link
            href={volver}
            aria-label="Volver"
            className="-ml-2 flex size-10 shrink-0 items-center justify-center"
          >
            <ChevronLeft className="size-6" />
          </Link>
        )}
        <div className="min-w-0 flex-1">
          {!volver && (
            <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Panel de tu marca
            </p>
          )}
          <h1 className="truncate text-2xl font-black">{titulo}</h1>
        </div>
        {accion}
      </div>
    </header>
  );
}
