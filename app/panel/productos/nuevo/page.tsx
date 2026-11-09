import type { Metadata } from "next";
import { Suspense } from "react";
import { AvisoListas, sinListas } from "../../aviso-listas";
import { EncabezadoPagina } from "../../encabezado-pagina";
import { obtenerCategorias, obtenerListas } from "../datos";
import { FormularioCargando } from "../formulario-cargando";
import { ProductoForm } from "../producto-form";

export const metadata: Metadata = {
  title: "Producto nuevo",
};

export default function NuevoProductoPage() {
  return (
    <>
      <EncabezadoPagina titulo="Producto nuevo" volver="/panel" />
      <div className="flex-1 bg-background">
        <div className="mx-auto w-full max-w-2xl px-4 pt-4">
          <Suspense fallback={<FormularioCargando />}>
            <Formulario />
          </Suspense>
        </div>
      </div>
    </>
  );
}

async function Formulario() {
  const [categorias, listas] = await Promise.all([
    obtenerCategorias(),
    obtenerListas(),
  ]);
  return (
    <div className="flex flex-col gap-5">
      {sinListas(listas) && <AvisoListas />}
      <ProductoForm categorias={categorias} listas={listas} />
    </div>
  );
}
