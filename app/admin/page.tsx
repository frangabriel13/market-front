import type { Metadata } from "next";
import { BotonSalir } from "@/components/boton-salir";

export const metadata: Metadata = {
  title: "Administración",
};

// Solo para ADMIN: proxy.ts redirige al resto. El contenido llega en la semana 2.
export default function AdminPage() {
  return (
    <main className="flex flex-1 flex-col px-4 py-8">
      <div className="mx-auto w-full max-w-sm">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Administración</h1>
          <BotonSalir />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Acá vas a gestionar las marcas y las categorías.
        </p>
      </div>
    </main>
  );
}
