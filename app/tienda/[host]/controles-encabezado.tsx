"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import type { CategoriaTienda } from "@/lib/schemas/tienda";
import { BotonCarrito } from "./boton-carrito";
import { SOBRE_OSCURO } from "./estilos";
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
          <Button asChild variant="ghost" size="icon" className={SOBRE_OSCURO}>
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

function Menu({ categorias }: Props) {
  if (categorias.length === 0) return <span />;
  return <MenuCategorias categorias={categorias} />;
}

function SegunRuta({
  enDatos,
  children,
}: {
  enDatos: React.ReactNode;
  children: React.ReactNode;
}) {
  return usePathname() === RUTA_DATOS_PEDIDO ? enDatos : children;
}
