import { ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { IconoWhatsapp } from "@/components/iconos-redes";
import { Button } from "@/components/ui/button";
import { urlDeTienda } from "@/lib/url-tienda";
import { Celular } from "./_landing/celular";
import { TEXTOS } from "./_landing/textos";

const PLATAFORMA = process.env.PLATFORM_NAME ?? "";
const DOMINIO = process.env.PLATFORM_DOMAIN ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(
    DOMINIO === "localhost" ? "http://localhost:3000" : `https://${DOMINIO}`,
  ),
  title: { absolute: `${PLATAFORMA} · ${TEXTOS.titulo}` },
  description: TEXTOS.descripcion,
  openGraph: {
    title: TEXTOS.titulo,
    description: TEXTOS.descripcion,
    siteName: PLATAFORMA,
    images: [{ url: "/landing/tienda-inicio.jpg", width: 750, height: 1520 }],
  },
};

// Las dos se cargan en el entorno; sin ellas, su botón no se muestra.
function enlaces() {
  const whatsapp = process.env.CONTACTO_WHATSAPP;
  const ejemplo = process.env.TIENDA_EJEMPLO;
  return {
    whatsapp: whatsapp
      ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`¡Hola! Quiero saber más sobre ${PLATAFORMA}.`)}`
      : null,
    ejemplo: ejemplo
      ? urlDeTienda({ slug: ejemplo, dominioPropio: null })
      : null,
  };
}

const EXTERNO = { target: "_blank", rel: "noopener noreferrer" } as const;

export default function Landing() {
  const { whatsapp, ejemplo } = enlaces();
  return (
    <>
      <header className="border-b">
        <div className="contenedor flex h-16 items-center justify-between">
          <p className="text-lg font-extrabold tracking-[0.14em] uppercase">
            {PLATAFORMA}
          </p>
          <Link
            href="/login"
            className="text-sm font-semibold underline-offset-4 hover:underline"
          >
            Ingresar
          </Link>
        </div>
      </header>

      <main className="flex flex-col">
        <section className="contenedor grid items-center gap-10 py-12 md:grid-cols-[1fr_auto] md:gap-16 md:py-20">
          <div className="flex flex-col gap-5">
            <p className="titulo-seccion text-muted-foreground">
              {TEXTOS.bajada}
            </p>
            <h1 className="text-4xl leading-[1.05] font-extrabold tracking-tight md:text-5xl">
              {TEXTOS.titulo}
            </h1>
            <p className="max-w-lg text-base text-foreground/80 md:text-lg">
              {TEXTOS.descripcion}
            </p>
            <Botones whatsapp={whatsapp} ejemplo={ejemplo} />
            <p className="text-sm text-muted-foreground">
              Cada marca tiene su dirección: <strong>tumarca.{DOMINIO}</strong>
            </p>
          </div>
          <Celular
            src={TEXTOS.capturas[0].src}
            alt={`Inicio de una tienda en ${PLATAFORMA}`}
            prioridad
            // En el celular ya aparece en "Así se ve", justo debajo.
            className="hidden md:block md:w-64 md:max-w-none"
          />
        </section>

        <section className="bg-muted py-12 md:py-16">
          <div className="contenedor flex flex-col gap-8">
            <h2 className="titulo-seccion">Cómo funciona</h2>
            <ol className="grid gap-6 md:grid-cols-3">
              {TEXTOS.pasos.map((paso, i) => (
                <li key={paso.titulo} className="flex gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center bg-foreground text-sm font-bold text-background">
                    {i + 1}
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="font-bold">{paso.titulo}</p>
                    <p className="text-sm text-foreground/75">{paso.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="contenedor flex flex-col gap-8 py-12 md:py-16">
          <h2 className="titulo-seccion">Así se ve</h2>
          <ul className="grid gap-10 sm:grid-cols-3 sm:gap-6">
            {TEXTOS.capturas.map((captura) => (
              <li
                key={captura.src}
                className="flex flex-col items-center gap-4"
              >
                <Celular src={captura.src} alt={captura.texto} />
                <p className="text-sm font-semibold">{captura.texto}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-y py-12 md:py-16">
          <div className="contenedor grid gap-6 md:grid-cols-[1fr_2fr]">
            <h2 className="titulo-seccion">Qué incluye</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {TEXTOS.incluye.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="contenedor flex flex-col items-center gap-4 py-14 text-center md:py-20">
          <h2 className="titulo">{TEXTOS.cierre.titulo}</h2>
          <p className="max-w-md text-foreground/80">{TEXTOS.cierre.texto}</p>
          <Botones whatsapp={whatsapp} ejemplo={ejemplo} centrados />
        </section>
      </main>

      <footer className="bg-marco text-marco-foreground">
        <div className="contenedor flex flex-col gap-2 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="font-extrabold tracking-[0.14em] uppercase">
            {PLATAFORMA}
          </p>
          <Link
            href="/login"
            className="text-marco-foreground/80 underline-offset-4 hover:underline"
          >
            Ingresar a tu panel
          </Link>
        </div>
      </footer>
    </>
  );
}

function Botones({
  whatsapp,
  ejemplo,
  centrados,
}: {
  whatsapp: string | null;
  ejemplo: string | null;
  centrados?: boolean;
}) {
  if (!whatsapp && !ejemplo) return null;
  return (
    <div
      className={
        centrados
          ? "flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
          : "flex flex-col gap-3 sm:flex-row"
      }
    >
      {whatsapp && (
        <Button asChild size="lg" variant="success">
          <a href={whatsapp} {...EXTERNO}>
            <IconoWhatsapp />
            Escribinos por WhatsApp
          </a>
        </Button>
      )}
      {ejemplo && (
        <Button asChild size="lg" variant="outline">
          <a href={ejemplo} {...EXTERNO}>
            Ver una tienda de ejemplo
            <ArrowRight />
          </a>
        </Button>
      )}
    </div>
  );
}
