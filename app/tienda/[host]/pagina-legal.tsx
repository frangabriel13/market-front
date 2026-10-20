import { formatearFecha } from "@/lib/formato";
import { ETIQUETAS_TEXTO_LEGAL, type TipoTextoLegal } from "@/lib/schemas/legales";
import { obtenerTextoLegal } from "./datos";
import { PaginaTexto, Seccion } from "./pagina-texto";

type Props = { tipo: TipoTextoLegal; params: Promise<{ host: string }> };

export function PaginaLegal({ tipo, params }: Props) {
  return (
    <PaginaTexto titulo={ETIQUETAS_TEXTO_LEGAL[tipo]}>
      <TextoLegal tipo={tipo} params={params} />
    </PaginaTexto>
  );
}

async function TextoLegal({ tipo, params }: Props) {
  const texto = await obtenerTextoLegal((await params).host, tipo);
  return (
    <>
      <Seccion>{texto.contenido}</Seccion>
      {texto.actualizadoEn && (
        <p className="pt-4 text-xs text-muted-foreground">
          Última actualización: {formatearFecha(texto.actualizadoEn)}
        </p>
      )}
    </>
  );
}
