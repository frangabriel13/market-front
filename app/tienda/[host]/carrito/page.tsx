import type { Metadata } from "next";
import { Suspense } from "react";
import { obtenerMarca } from "../datos";
import { Carrito, CarritoCargando } from "./carrito";

export const metadata: Metadata = {
  title: "Tu pedido",
};

export default function CarritoPage({ params }: PageProps<"/tienda/[host]/carrito">) {
  return (
    <div className="contenedor flex flex-1 flex-col pt-5 md:pt-7">
      <h1 className="titulo mb-4 md:mb-6">Tu pedido</h1>
      <Suspense fallback={<CarritoCargando />}>
        <CarritoDeLaMarca params={params} />
      </Suspense>
    </div>
  );
}

async function CarritoDeLaMarca({ params }: { params: Promise<{ host: string }> }) {
  const marca = await obtenerMarca((await params).host);
  return (
    <Carrito
      minimoCompra={marca.minimoCompra}
      hayEnvio={marca.opcionesEntrega.some((o) => o.tipo === "ENVIO")}
    />
  );
}
