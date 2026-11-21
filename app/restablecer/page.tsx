import type { Metadata } from "next";
import { Suspense } from "react";
import { PantallaAuth } from "@/components/pantalla-auth";
import { LinkVencido } from "./link-vencido";
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
  if (typeof token !== "string" || !token) return <LinkVencido />;
  return <RestablecerForm token={token} />;
}
