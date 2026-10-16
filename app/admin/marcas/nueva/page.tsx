import type { Metadata } from "next";
import { MarcaForm } from "../marca-form";
import { Volver } from "@/components/volver";

export const metadata: Metadata = {
  title: "Nueva marca",
};

export default function NuevaMarcaPage() {
  return (
    <>
      <Volver href="/admin" texto="Marcas" />
      <h1 className="mb-6 text-2xl font-bold">Nueva marca</h1>
      <MarcaForm dominio={process.env.PLATFORM_DOMAIN ?? ""} />
    </>
  );
}
