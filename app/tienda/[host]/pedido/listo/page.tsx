import type { Metadata } from "next";
import { PedidoListo } from "./pedido-listo";

export const metadata: Metadata = {
  title: "Tu pedido está armado",
};

export default function PedidoListoPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pt-6">
      <PedidoListo />
    </div>
  );
}
