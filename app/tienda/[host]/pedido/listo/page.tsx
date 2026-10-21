import type { Metadata } from "next";
import { PedidoListo } from "./pedido-listo";

export const metadata: Metadata = {
  title: "Tu pedido está armado",
};

export default function PedidoListoPage() {
  return (
    <div className="mx-auto w-full max-w-md px-4 pt-10">
      <PedidoListo />
    </div>
  );
}
