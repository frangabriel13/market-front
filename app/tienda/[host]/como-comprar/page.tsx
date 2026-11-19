import type { Metadata } from "next";
import { formatearPrecio } from "@/lib/formato";
import { obtenerMarca } from "../datos";
import { ETIQUETAS_TIPO_ENTREGA } from "@/lib/schemas/opciones-entrega";
import { PaginaTexto, Seccion } from "../pagina-texto";
import { RUTA_COMO_COMPRAR } from "../rutas";

// Si la marca no cargó su texto.
const PASOS = [
  "Elegí los productos y las cantidades por color y talle.",
  "Completá tus datos y la forma de entrega.",
  "Enviá el pedido por WhatsApp: ahí coordinás el pago y la entrega con la marca.",
];

export const metadata: Metadata = {
  title: "Cómo comprar",
};

export default function ComoComprarPage({
  params,
}: PageProps<"/tienda/[host]/como-comprar">) {
  return (
    <PaginaTexto titulo="Cómo comprar" ruta={RUTA_COMO_COMPRAR}>
      <ComoComprar params={params} />
    </PaginaTexto>
  );
}

async function ComoComprar({ params }: { params: Promise<{ host: string }> }) {
  const marca = await obtenerMarca((await params).host);
  const hayRetiro = marca.opcionesEntrega.some((o) => o.tipo === "RETIRO");
  return (
    <>
      <Seccion>
        {marca.comoComprar || (
          <ol className="flex flex-col gap-3 whitespace-normal">
            {PASOS.map((paso, i) => (
              <li key={paso} className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center bg-foreground text-xs font-bold text-background">
                  {i + 1}
                </span>
                <span className="pt-0.5">{paso}</span>
              </li>
            ))}
          </ol>
        )}
      </Seccion>
      {marca.minimoCompra > 0 && (
        <Seccion titulo="Compra mínima">
          {formatearPrecio(marca.minimoCompra)} por pedido.
        </Seccion>
      )}
      {marca.opcionesEntrega.length > 0 && (
        <Seccion titulo="Entrega">
          <ul className="flex flex-col gap-1 whitespace-normal">
            {marca.opcionesEntrega.map((opcion) => (
              <li key={opcion.id}>
                <span className="font-semibold text-foreground">
                  {opcion.nombre}
                </span>
                <span className="text-muted-foreground">
                  {" "}
                  · {ETIQUETAS_TIPO_ENTREGA[opcion.tipo]}
                </span>
              </li>
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
