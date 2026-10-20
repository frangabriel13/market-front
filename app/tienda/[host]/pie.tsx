import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import {
  IconoFacebook,
  IconoInstagram,
  IconoTiktok,
  IconoWhatsapp,
} from "@/components/iconos-redes";
import { Button } from "@/components/ui/button";
import { ETIQUETAS_TEXTO_LEGAL } from "@/lib/schemas/legales";
import type { Redes } from "@/lib/schemas/marcas";
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
  return (
    <footer className="mt-12 bg-foreground text-background">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-10 text-center">
        <p className="font-bold tracking-widest uppercase">{marca.nombre}</p>
        <Button asChild variant="outline" size="lg" className="text-foreground">
          <a href={`https://wa.me/${marca.whatsapp}`} {...EXTERNO}>
            <IconoWhatsapp />
            Escribinos por WhatsApp
          </a>
        </Button>
        {redes.length > 0 && (
          <ul className="flex gap-6">
            {redes.map(({ clave, nombre, Icono, href }) => (
              <li key={clave}>
                <a href={href} aria-label={nombre} {...EXTERNO}>
                  <Icono className="size-6" />
                </a>
              </li>
            ))}
          </ul>
        )}
        <nav aria-label="Información">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {paginas.map(({ href, texto }) => (
              <li key={href}>
                <Link href={href} className="underline-offset-4 hover:underline">
                  {texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
