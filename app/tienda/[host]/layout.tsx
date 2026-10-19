import type { Metadata } from "next";
import { Suspense } from "react";
import { obtenerMarca } from "./datos";
import { Encabezado, EncabezadoCargando } from "./encabezado";
import { Pie } from "./pie";

export async function generateMetadata({
  params,
}: LayoutProps<"/tienda/[host]">): Promise<Metadata> {
  const { nombre } = await obtenerMarca((await params).host);
  return { title: { default: nombre, template: `%s · ${nombre}` } };
}

export default function TiendaLayout({
  children,
  params,
}: LayoutProps<"/tienda/[host]">) {
  return (
    <>
      <Suspense fallback={<EncabezadoCargando />}>
        <Encabezado params={params} />
      </Suspense>
      <main className="flex flex-1 flex-col">{children}</main>
      <Suspense>
        <Pie params={params} />
      </Suspense>
    </>
  );
}
