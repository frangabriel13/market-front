import type { Metadata } from "next";
import { Suspense } from "react";
import { Volver } from "@/components/volver";
import { obtenerCategorias } from "../datos";
import { FormularioCargando } from "../formulario-cargando";
import { ProductoForm } from "../producto-form";

export const metadata: Metadata = {
  title: "Nuevo producto",
};

export default function NuevoProductoPage() {
  return (
    <>
      <Volver href="/panel" texto="Productos" />
      <h1 className="mb-6 text-2xl font-bold">Nuevo producto</h1>
      <Suspense fallback={<FormularioCargando />}>
        <Formulario />
      </Suspense>
    </>
  );
}

async function Formulario() {
  return <ProductoForm categorias={await obtenerCategorias()} />;
}
