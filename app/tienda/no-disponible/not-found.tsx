import { Store } from "lucide-react";

export default function TiendaNoDisponible() {
  const plataforma = process.env.PLATFORM_NAME;
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <title>Tienda no disponible</title>
      <Store className="size-10 text-muted-foreground" strokeWidth={1.5} />
      <h1 className="titulo">Tienda no disponible</h1>
      <p className="max-w-xs text-sm text-muted-foreground">
        Revisá que la dirección esté bien escrita o probá más tarde.
      </p>
      {plataforma && (
        <p className="mt-8 text-xs font-extrabold tracking-[0.14em] text-muted-foreground uppercase">
          {plataforma}
        </p>
      )}
    </main>
  );
}
