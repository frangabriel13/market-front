import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { obtenerMarca } from "../datos";
import { DatosPedido } from "./datos-pedido";

export const metadata: Metadata = {
  title: "Datos del pedido",
};

export default function PedidoPage({ params }: PageProps<"/tienda/[host]/pedido">) {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 pt-6">
      <h1 className="titulo mb-5 text-3xl">Datos del pedido</h1>
      <Suspense fallback={<FormularioCargando />}>
        <DatosPedidoDeLaMarca params={params} />
      </Suspense>
    </div>
  );
}

async function DatosPedidoDeLaMarca({ params }: { params: Promise<{ host: string }> }) {
  const marca = await obtenerMarca((await params).host);
  return <DatosPedido marca={marca} />;
}

function FormularioCargando() {
  return (
    <div className="flex flex-col gap-3" aria-busy="true">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
