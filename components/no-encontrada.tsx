import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = { volverA?: { href: string; texto: string } };

export function NoEncontrada({ volverA }: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <p aria-hidden="true" className="text-6xl font-extrabold tracking-tight">
        404
      </p>
      <h1 className="titulo-seccion">No encontramos esta página</h1>
      <p className="max-w-xs text-sm text-muted-foreground">
        Puede que el link esté mal o que ya no exista.
      </p>
      {volverA && (
        <Button asChild className="mt-2">
          <Link href={volverA.href}>{volverA.texto}</Link>
        </Button>
      )}
    </div>
  );
}
