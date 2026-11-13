import type { Metadata } from "next";
import { Suspense } from "react";
import { obtenerTodos } from "../datos";
import { GrillaProductos, GrillaProductosCargando } from "../grilla-productos";
import { Migas } from "../migas";
import { RUTA_PRODUCTOS } from "../rutas";

type Props = PageProps<"/tienda/[host]/productos">;

export const metadata: Metadata = {
  title: "Todos los productos",
};

export default function TodosLosProductosPage({ params }: Props) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 pt-4">
      <Migas
        migas={[
          { href: "/", texto: "Inicio" },
          { href: RUTA_PRODUCTOS, texto: "Todos los productos" },
        ]}
      />
      <h1 className="titulo text-3xl">Todos los productos</h1>
      <Suspense fallback={<GrillaProductosCargando />}>
        <Listado params={params} />
      </Suspense>
    </div>
  );
}

async function Listado({ params }: Pick<Props, "params">) {
  const productos = await obtenerTodos((await params).host);
  if (productos.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Todavía no hay productos.
      </p>
    );
  }
  return <GrillaProductos productos={productos} />;
}

