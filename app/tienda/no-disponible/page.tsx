import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tienda no disponible",
};

export default function TiendaNoDisponiblePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="text-xl font-bold">Tienda no disponible</h1>
      <p className="text-sm text-muted-foreground">
        Revisá que la dirección esté bien escrita o probá más tarde.
      </p>
    </main>
  );
}
