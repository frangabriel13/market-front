import type { Metadata } from "next";
import { Suspense } from "react";
import { EncabezadoPagina } from "../../encabezado-pagina";
import { InterruptorVisible } from "../../interruptor-visible";
import { obtenerCategorias, obtenerListas, obtenerProducto } from "../datos";
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
  const [producto, categorias, listas] = await Promise.all([
    obtenerProducto(id),
    obtenerCategorias(),
    obtenerListas(),
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
          <p
            role="alert"
            className="mb-5 border-l-2 border-destructive bg-destructive/5 px-3 py-3 text-sm text-destructive"
          >
            Creamos el producto, pero algunas fotos o la disponibilidad no se
            guardaron. Revisalas acá y probá de nuevo.
          </p>
        )}
        <div className="flex flex-col gap-6">
          <FotosProducto productoId={producto.id} fotos={producto.fotos} />
          <div className="border-t pt-6">
            <ProductoForm
              producto={producto}
              categorias={categorias}
              listas={listas}
            />
          </div>
        </div>
        <section className="mt-8 flex flex-col gap-3 border-t pt-6">
          <h2 className="titulo-seccion">Eliminar</h2>
          <p className="text-sm text-muted-foreground">
            Si solo querés que no se vea en la tienda, ocultalo con el
            interruptor de arriba.
          </p>
          <EliminarProducto productoId={producto.id} nombre={producto.nombre} />
        </section>
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
