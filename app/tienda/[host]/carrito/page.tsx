import type { Metadata } from "next";
import { Suspense } from "react";
import { obtenerMarca } from "../datos";
import { Carrito, CarritoCargando } from "./carrito";

export const metadata: Metadata = {
  title: "Tu pedido",
};

export default function CarritoPage({ params }: PageProps<"/tienda/[host]/carrito">) {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 pt-6">
      <h1 className="mb-4 text-xl font-bold tracking-wide uppercase">Tu pedido</h1>
      <Suspense fallback={<CarritoCargando />}>
        <CarritoDeLaMarca params={params} />
      </Suspense>
    </div>
  );
}

async function CarritoDeLaMarca({ params }: { params: Promise<{ host: string }> }) {
  const { minimoCompra } = await obtenerMarca((await params).host);
  return <Carrito minimoCompra={minimoCompra} />;
}
