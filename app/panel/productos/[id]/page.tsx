import type { Metadata } from "next";
import { Suspense } from "react";
import { EncabezadoPagina } from "../../encabezado-pagina";
import { InterruptorVisible } from "../../interruptor-visible";
import { obtenerCategorias, obtenerMarca, obtenerProducto } from "../datos";
import { EliminarProducto } from "../eliminar-producto";
import { FormularioCargando } from "../formulario-cargando";
import { FotosProducto } from "../fotos-producto";
import { ProductoForm } from "../producto-form";

export const metadata: Metadata = {
  title: "Editar producto",
};

type Props = PageProps<"/panel/productos/[id]">;

export default function EditarProductoPage({ params, searchParams }: Props) {
  return (
    <Suspense
      fallback={
        <>
          <EncabezadoPagina titulo="Producto" volver="/panel" />
          <Cuerpo>
            <FormularioCargando />
          </Cuerpo>
        </>
      }
    >
      <EditarProducto params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function EditarProducto({ params, searchParams }: Props) {
  const [{ id }, { incompleto }] = await Promise.all([params, searchParams]);
  const [producto, categorias, marca] = await Promise.all([
    obtenerProducto(id),
    obtenerCategorias(),
    obtenerMarca(),
  ]);
  return (
    <>
      <EncabezadoPagina
        titulo={producto.nombre}
        volver="/panel"
        accion={
          <InterruptorVisible
            productoId={producto.id}
            nombre={producto.nombre}
            visible={producto.visible}
          />
        }
      />
      <Cuerpo>
        {incompleto && (
          <p role="alert" className="mb-4 bg-muted p-3 text-sm">
            Creamos el producto, pero algunas fotos o la disponibilidad no se
            guardaron. Revisalas acá y probá de nuevo.
          </p>
        )}
        <div className="flex flex-col gap-5">
          <FotosProducto productoId={producto.id} fotos={producto.fotos} />
          <ProductoForm
            producto={producto}
            categorias={categorias}
            marca={marca}
          />
        </div>
        <EliminarProducto productoId={producto.id} nombre={producto.nombre} />
      </Cuerpo>
    </>
  );
}

function Cuerpo({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 bg-background pb-8">
      <div className="mx-auto flex w-full max-w-2xl flex-col px-4 pt-4">
        {children}
      </div>
    </div>
  );
}
