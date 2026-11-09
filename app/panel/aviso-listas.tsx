import { Palette } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ListasPanel } from "@/lib/schemas/listas";

export const RUTA_LISTAS = "/panel/colores-y-talles";

// Una marca nueva arranca sin colores ni talles: los productos los eligen de ahí.
export function sinListas({ colores, listasTalles }: ListasPanel) {
  return (
    colores.length === 0 && listasTalles.every((l) => l.talles.length === 0)
  );
}

export function AvisoListas() {
  return (
    <div className="flex flex-col gap-3 border-2 border-foreground bg-background p-4">
      <div>
        <p className="font-black">Antes de tu primer producto</p>
        <p className="text-sm text-muted-foreground">
          Armá los colores y los talles de tu marca. Cada producto elige los
          suyos de esas listas.
        </p>
      </div>
      <Button asChild className="self-start">
        <Link href={RUTA_LISTAS}>
          <Palette />
          Armar colores y talles
        </Link>
      </Button>
    </div>
  );
}
