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
const LINK = "underline underline-offset-4 hover:no-underline";

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

  return (
    <footer className="mt-16 bg-foreground text-background">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
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
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
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
    </footer>
  );
}

function Bloque({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-1 text-xs font-bold tracking-widest uppercase">
        {titulo}
      </h2>
      <p className="text-sm whitespace-pre-line text-background/80">
        {children}
      </p>
    </section>
  );
}
