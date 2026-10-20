import type { Metadata } from "next";
import { ETIQUETAS_TEXTO_LEGAL } from "@/lib/schemas/legales";
import { PaginaLegal } from "../pagina-legal";

export const metadata: Metadata = {
  title: ETIQUETAS_TEXTO_LEGAL.PRIVACIDAD,
};

export default function PrivacidadPage({
  params,
}: PageProps<"/tienda/[host]/privacidad">) {
  return <PaginaLegal tipo="PRIVACIDAD" params={params} />;
}
