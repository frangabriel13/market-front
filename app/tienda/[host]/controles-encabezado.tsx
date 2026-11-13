"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import type { CategoriaTienda } from "@/lib/schemas/tienda";
import { BotonCarrito } from "./boton-carrito";
import { MenuCategorias } from "./menu-categorias";
import { RUTA_CARRITO, RUTA_DATOS_PEDIDO } from "./rutas";

type Props = { categorias: CategoriaTienda[] };

// En "Datos del pedido" el encabezado solo deja volver al carrito, para no
// distraer mientras completa los datos.
export function ControlIzquierdo({ categorias }: Props) {
  return (
    <Suspense fallback={<Menu categorias={categorias} />}>
      <SegunRuta
        enDatos={
          <Button asChild variant="ghost" size="icon">
            <Link href={RUTA_CARRITO} aria-label="Volver a tu pedido">
              <ChevronLeft className="size-5" />
            </Link>
          </Button>
        }
      >
        <Menu categorias={categorias} />
      </SegunRuta>
    </Suspense>
  );
}

export function ControlDerecho() {
  return (
    <Suspense fallback={<BotonCarrito />}>
      <SegunRuta enDatos={<span />}>
        <BotonCarrito />
      </SegunRuta>
    </Suspense>
  );
}

type Enlace = { href: string; texto: string };

// Solo en escritorio; en "Datos del pedido" no se muestra.
export function NavEscritorio({ enlaces }: { enlaces: Enlace[] }) {
  if (enlaces.length === 0) return <span className="hidden md:block" />;
  return (
    <Suspense fallback={<Enlaces enlaces={enlaces} />}>
      <SegunRuta
        enDatos={
          <Link
            href={RUTA_CARRITO}
            className="hidden items-center gap-1 text-sm font-semibold hover:underline md:flex"
          >
            <ChevronLeft className="size-4" />
            Volver a tu pedido
          </Link>
        }
      >
        <EnlacesConRuta enlaces={enlaces} />
      </SegunRuta>
    </Suspense>
  );
}

function EnlacesConRuta({ enlaces }: { enlaces: Enlace[] }) {
  return <Enlaces enlaces={enlaces} actual={usePathname()} />;
}

function Enlaces({ enlaces, actual }: { enlaces: Enlace[]; actual?: string }) {
  return (
    <nav aria-label="Categorías" className="hidden md:block">
      <ul className="flex gap-7">
        {enlaces.map(({ href, texto }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={actual === href ? "page" : undefined}
              className="block py-2 text-sm font-semibold underline-offset-8 hover:underline aria-[current=page]:underline"
            >
              {texto}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Menu({ categorias }: Props) {
  if (categorias.length === 0) return <span />;
  return <MenuCategorias categorias={categorias} />;
}

function SegunRuta({
  enDatos,
  children,
}: {
  enDatos: ReactNode;
  children: ReactNode;
}) {
  return usePathname() === RUTA_DATOS_PEDIDO ? enDatos : children;
}
