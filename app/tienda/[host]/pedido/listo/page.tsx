import type { Metadata } from "next";
import { PorVisita } from "../../por-visita";
import { PedidoListo } from "./pedido-listo";

export const metadata: Metadata = {
  title: "Tu pedido está armado",
};

export default function PedidoListoPage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pt-8 md:pt-12">
      <PedidoListo />
      <PorVisita />
    </div>
  );
}
