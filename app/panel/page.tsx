import { Palette, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BotonSalir } from "@/components/boton-salir";
import { Button } from "@/components/ui/button";
import { AvisoListas, RUTA_LISTAS, sinListas } from "./aviso-listas";
import { EncabezadoPagina } from "./encabezado-pagina";
import { ListaProductos, ListaProductosCargando } from "./lista-productos";
import { NavInferior } from "./nav-inferior";
import { obtenerListas } from "./productos/datos";

export const metadata: Metadata = {
  title: "Productos",
};

export default function PanelPage() {
  return (
    <>
      <EncabezadoPagina titulo="Mis productos" accion={<BotonSalir />} />
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 pt-4 pb-24">
        <Suspense fallback={<Botones conListas />}>
          <BotonesConAviso />
        </Suspense>
        <Suspense fallback={<ListaProductosCargando />}>
          <ListaProductos />
        </Suspense>
      </div>
      <NavInferior actual="productos" />
    </>
  );
}

// Sin listas, el aviso reemplaza al botón de "Colores y talles".
async function BotonesConAviso() {
  if (!sinListas(await obtenerListas())) return <Botones conListas />;
  return (
    <>
      <AvisoListas />
      <Botones />
    </>
  );
}

function Botones({ conListas }: { conListas?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <Button asChild size="lg" className="h-14 w-full">
        <Link href="/panel/productos/nuevo">
          <Plus className="size-5" />
          Cargar producto nuevo
        </Link>
      </Button>
      {conListas && (
        <Button asChild variant="outline" size="lg" className="w-full">
          <Link href={RUTA_LISTAS}>
            <Palette className="size-5" />
            Colores y talles
          </Link>
        </Button>
      )}
    </div>
  );
}
