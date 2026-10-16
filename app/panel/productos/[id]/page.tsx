import type { Metadata } from "next";
import { Suspense } from "react";
import { Volver } from "@/components/volver";
import { InterruptorVisible } from "../../interruptor-visible";
import { obtenerCategorias, obtenerMarca, obtenerProducto } from "../datos";
import { Disponibilidad } from "../disponibilidad";
import { EliminarProducto } from "../eliminar-producto";
import { FormularioCargando } from "../formulario-cargando";
import { FotosProducto } from "../fotos-producto";
import { ProductoForm } from "../producto-form";

export const metadata: Metadata = {
  title: "Editar producto",
};

export default function EditarProductoPage({
  params,
}: PageProps<"/panel/productos/[id]">) {
  return (
    <>
      <Volver href="/panel" texto="Productos" />
      <Suspense fallback={<FormularioCargando />}>
        <EditarProducto params={params} />
      </Suspense>
    </>
  );
}

async function EditarProducto({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [producto, categorias, marca] = await Promise.all([
    obtenerProducto(id),
    obtenerCategorias(),
    obtenerMarca(),
  ]);
  return (
    <>
      <div className="mb-6 flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold">{producto.nombre}</h1>
        <InterruptorVisible
          productoId={producto.id}
          nombre={producto.nombre}
          visible={producto.visible}
        />
      </div>
      <FotosProducto productoId={producto.id} fotos={producto.fotos} />
      <Disponibilidad
        productoId={producto.id}
        variantes={producto.variantes}
        marca={marca}
      />
      <h2 className="mb-4 text-base font-medium">Datos del producto</h2>
      <ProductoForm producto={producto} categorias={categorias} />
      <EliminarProducto productoId={producto.id} nombre={producto.nombre} />
    </>
  );
}
