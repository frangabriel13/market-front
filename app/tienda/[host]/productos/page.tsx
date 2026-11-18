import type { Metadata } from "next";
import { Suspense } from "react";
import { obtenerTodos } from "../datos";
import {
  GrillaProductos,
  GrillaProductosCargando,
  SinProductos,
  TituloListado,
} from "../grilla-productos";
import { Migas } from "../migas";
import { RUTA_PRODUCTOS } from "../rutas";

type Props = PageProps<"/tienda/[host]/productos">;

export const metadata: Metadata = {
  title: "Todos los productos",
};

export default function TodosLosProductosPage({ params }: Props) {
  return (
    <div className="contenedor flex flex-col gap-3 pt-4 md:gap-4">
      <Migas
        migas={[
          { href: "/", texto: "Inicio" },
          { href: RUTA_PRODUCTOS, texto: "Todos los productos" },
        ]}
      />
      <Suspense
        fallback={
          <>
            <TituloListado titulo="Todos los productos" />
            <GrillaProductosCargando />
          </>
        }
      >
        <Listado params={params} />
      </Suspense>
    </div>
  );
}

async function Listado({ params }: Pick<Props, "params">) {
  const productos = await obtenerTodos((await params).host);
  return (
    <>
      <TituloListado titulo="Todos los productos" cantidad={productos.length} />
      {productos.length > 0 ? (
        <GrillaProductos productos={productos} />
      ) : (
        <SinProductos />
      )}
    </>
  );
}

