import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorFormulario } from "@/components/form/error-formulario";
import { PantallaAuth } from "@/components/pantalla-auth";
import { RestablecerForm } from "./restablecer-form";

export const metadata: Metadata = {
  title: "Elegí tu contraseña",
};

export default function RestablecerPage({
  searchParams,
}: PageProps<"/restablecer">) {
  return (
    <PantallaAuth
      titulo="Elegí tu contraseña nueva"
      descripcion="Usá al menos 8 caracteres."
    >
      <Suspense>
        <Contenido searchParams={searchParams} />
      </Suspense>
    </PantallaAuth>
  );
}

async function Contenido({
  searchParams,
}: Pick<PageProps<"/restablecer">, "searchParams">) {
  const { token } = await searchParams;
  if (typeof token !== "string" || !token) {
    return (
      <ErrorFormulario>
        El link no es válido.{" "}
        <Link href="/recuperar" className="font-medium underline">
          Pedí uno nuevo
        </Link>
      </ErrorFormulario>
    );
  }
  return <RestablecerForm token={token} />;
}
