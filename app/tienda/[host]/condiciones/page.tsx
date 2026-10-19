import type { Metadata } from "next";
import { obtenerMarca } from "../datos";
import { PaginaTexto, Seccion } from "../pagina-texto";

export const metadata: Metadata = {
  title: "Condiciones de venta",
};

export default function CondicionesPage({
  params,
}: PageProps<"/tienda/[host]/condiciones">) {
  return (
    <PaginaTexto titulo="Condiciones de venta">
      <Condiciones params={params} />
    </PaginaTexto>
  );
}

async function Condiciones({ params }: { params: Promise<{ host: string }> }) {
  const { condicionesVenta } = await obtenerMarca((await params).host);
  return condicionesVenta ? (
    <Seccion>{condicionesVenta}</Seccion>
  ) : (
    <p className="text-sm text-muted-foreground">
      Todavía no hay condiciones de venta cargadas.
    </p>
  );
}
