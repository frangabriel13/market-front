import type { Metadata } from "next";
import { formatearPrecio } from "@/lib/formato";
import { obtenerMarca } from "../datos";
import { PaginaTexto, Seccion } from "../pagina-texto";

const COMO_COMPRAR_GENERAL =
  "Elegí los productos, armá tu pedido y envialo por WhatsApp. Te respondemos para coordinar el pago y la entrega.";

export const metadata: Metadata = {
  title: "Cómo comprar",
};

export default function ComoComprarPage({
  params,
}: PageProps<"/tienda/[host]/como-comprar">) {
  return (
    <PaginaTexto titulo="Cómo comprar">
      <ComoComprar params={params} />
    </PaginaTexto>
  );
}

async function ComoComprar({ params }: { params: Promise<{ host: string }> }) {
  const marca = await obtenerMarca((await params).host);
  const hayRetiro = marca.opcionesEntrega.some((o) => o.tipo === "RETIRO");
  return (
    <>
      <Seccion>{marca.comoComprar || COMO_COMPRAR_GENERAL}</Seccion>
      {marca.minimoCompra > 0 && (
        <Seccion titulo="Compra mínima">
          {formatearPrecio(marca.minimoCompra)} por pedido.
        </Seccion>
      )}
      {marca.opcionesEntrega.length > 0 && (
        <Seccion titulo="Entrega">
          <ul className="list-inside list-disc">
            {marca.opcionesEntrega.map((opcion) => (
              <li key={opcion.id}>{opcion.nombre}</li>
            ))}
          </ul>
        </Seccion>
      )}
      {hayRetiro && (marca.direccionRetiro || marca.horariosRetiro) && (
        <Seccion titulo="Retiro">
          {[marca.direccionRetiro, marca.horariosRetiro]
            .filter(Boolean)
            .join("\n")}
        </Seccion>
      )}
    </>
  );
}
