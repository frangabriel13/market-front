import type { Metadata } from "next";
import { ETIQUETAS_TEXTO_LEGAL } from "@/lib/schemas/legales";
import { PaginaLegal } from "../pagina-legal";

export const metadata: Metadata = {
  title: ETIQUETAS_TEXTO_LEGAL.TERMINOS,
};

export default function TerminosPage({
  params,
}: PageProps<"/tienda/[host]/terminos">) {
  return <PaginaLegal tipo="TERMINOS" params={params} />;
}
