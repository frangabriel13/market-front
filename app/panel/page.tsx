import type { Metadata } from "next";
import { BotonSalir } from "@/components/boton-salir";

export const metadata: Metadata = {
  title: "Tu panel",
};

// Solo para fabricantes: proxy.ts redirige al resto. El contenido llega en la semana 3.
export default function PanelPage() {
  return (
    <main className="flex flex-1 flex-col px-4 py-8">
      <div className="mx-auto w-full max-w-sm">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Tu panel</h1>
          <BotonSalir />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Acá vas a cargar tus productos y ver tus pedidos.
        </p>
      </div>
    </main>
  );
}
