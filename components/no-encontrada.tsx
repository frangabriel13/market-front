import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = { volverA?: { href: string; texto: string } };

export function NoEncontrada({ volverA }: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="text-xl font-bold">No encontramos esta página</h1>
      <p className="text-sm text-muted-foreground">
        Puede que el link esté mal o que ya no exista.
      </p>
      {volverA && (
        <Button asChild variant="outline">
          <Link href={volverA.href}>{volverA.texto}</Link>
        </Button>
      )}
    </div>
  );
}
