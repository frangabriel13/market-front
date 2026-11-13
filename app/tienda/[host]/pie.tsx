import Link from "next/link";
import type { ComponentType, ReactNode, SVGProps } from "react";
import {
  IconoFacebook,
  IconoInstagram,
  IconoTiktok,
} from "@/components/iconos-redes";
import { ETIQUETAS_TEXTO_LEGAL } from "@/lib/schemas/legales";
import type { Redes } from "@/lib/schemas/marcas";
import { formatearTelefono } from "@/lib/schemas/telefono";
import { obtenerMarca } from "./datos";
import { RUTA_COMO_COMPRAR, RUTA_CONDICIONES, RUTAS_LEGALES } from "./rutas";

const REDES: {
  clave: keyof Redes;
  nombre: string;
  Icono: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  { clave: "instagram", nombre: "Instagram", Icono: IconoInstagram },
  { clave: "facebook", nombre: "Facebook", Icono: IconoFacebook },
  { clave: "tiktok", nombre: "TikTok", Icono: IconoTiktok },
];

const EXTERNO = { target: "_blank", rel: "noopener noreferrer" } as const;
const LINK = "underline-offset-4 hover:underline";
const TITULO = "mb-2 text-[11px] font-bold tracking-[0.12em] text-background/60 uppercase";

export async function Pie({ params }: { params: Promise<{ host: string }> }) {
  const marca = await obtenerMarca((await params).host);
  const redes = REDES.flatMap((red) => {
    const href = marca.redes[red.clave];
    return href ? [{ ...red, href }] : [];
  });
  const paginas = [
    { href: RUTA_COMO_COMPRAR, texto: "Cómo comprar" },
    ...(marca.condicionesVenta
      ? [{ href: RUTA_CONDICIONES, texto: "Condiciones de venta" }]
      : []),
    ...marca.textosLegales.map((tipo) => ({
      href: RUTAS_LEGALES[tipo],
      texto: ETIQUETAS_TEXTO_LEGAL[tipo],
    })),
  ];
  const hayRetiro = marca.opcionesEntrega.some((o) => o.tipo === "RETIRO");
  const retiro = [marca.direccionRetiro, marca.horariosRetiro].filter(Boolean);

  const plataforma = process.env.PLATFORM_NAME;

  return (
    <footer className="mt-16 bg-foreground text-background">
      <div className="mx-auto grid max-w-5xl gap-7 px-4 py-9 md:grid-cols-3 md:py-12">
        {hayRetiro && retiro.length > 0 && (
          <Bloque titulo="Retiros">{retiro.join("\n")}</Bloque>
        )}
        <Bloque titulo="Contacto">
          <a
            href={`https://wa.me/${marca.whatsapp}`}
            className={LINK}
            {...EXTERNO}
          >
            WhatsApp {formatearTelefono(marca.whatsapp)}
          </a>
        </Bloque>
        <nav aria-label="Información">
          <h2 className={TITULO}>Información</h2>
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm md:flex-col md:gap-2">
            {paginas.map(({ href, texto }) => (
              <li key={href}>
                <Link href={href} className={LINK}>
                  {texto}
                </Link>
              </li>
            ))}
            {redes.map(({ clave, nombre, Icono, href }) => (
              <li key={clave}>
                <a
                  href={href}
                  className={`inline-flex items-center gap-1.5 ${LINK}`}
                  {...EXTERNO}
                >
                  <Icono className="size-4" />
                  {nombre}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {plataforma && (
        <p className="border-t border-background/15 px-4 py-4 text-center text-xs text-background/60">
          Tienda hecha con {plataforma}
        </p>
      )}
    </footer>
  );
}

function Bloque({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section>
      <h2 className={TITULO}>{titulo}</h2>
      <p className="text-sm whitespace-pre-line">
        {children}
      </p>
    </section>
  );
}
