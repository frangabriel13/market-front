import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

type Props = {
  titulo: string;
  // Con `volver`, flecha atrás en lugar del "Panel de tu marca".
  volver?: string;
  accion?: ReactNode;
};

export function EncabezadoPagina({ titulo, volver, accion }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background">
      <div className="mx-auto flex min-h-16 w-full max-w-2xl items-center gap-2 px-4 py-2.5">
        {volver && (
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="-ml-3 shrink-0"
          >
            <Link href={volver} aria-label="Volver">
              <ChevronLeft className="size-6" />
            </Link>
          </Button>
        )}
        <div className="min-w-0 flex-1">
          {!volver && (
            <p className="text-[11px] font-extrabold tracking-[0.14em] text-muted-foreground uppercase">
              Panel de tu marca
            </p>
          )}
          <h1 className="titulo truncate">{titulo}</h1>
        </div>
        {accion}
      </div>
    </header>
  );
}
