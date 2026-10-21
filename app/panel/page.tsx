import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BotonSalir } from "@/components/boton-salir";
import { Button } from "@/components/ui/button";
import { EncabezadoPagina } from "./encabezado-pagina";
import { ListaProductos, ListaProductosCargando } from "./lista-productos";
import { NavInferior } from "./nav-inferior";

export const metadata: Metadata = {
  title: "Productos",
};

export default function PanelPage() {
  return (
    <>
      <EncabezadoPagina titulo="Mis productos" accion={<BotonSalir />} />
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 pt-4 pb-24">
        <Button asChild size="lg" className="h-14 w-full">
          <Link href="/panel/productos/nuevo">
            <Plus className="size-5" />
            Cargar producto nuevo
          </Link>
        </Button>
        <Suspense fallback={<ListaProductosCargando />}>
          <ListaProductos />
        </Suspense>
      </div>
      <NavInferior actual="productos" />
    </>
  );
}
