import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { EncabezadoPagina } from "../encabezado-pagina";
import { obtenerListas } from "../productos/datos";
import { guardarColores } from "./acciones";
import { EditorValores } from "./editor-valores";
import { ListaTalles } from "./lista-talles";
import { NuevaLista } from "./nueva-lista";

export const metadata: Metadata = {
  title: "Colores y talles",
};

export default function ColoresYTallesPage() {
  return (
    <>
      <EncabezadoPagina titulo="Colores y talles" volver="/panel" />
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 pt-4 pb-10">
        <Suspense fallback={<Cargando />}>
          <Listas />
        </Suspense>
      </div>
    </>
  );
}

async function Listas() {
  const { colores, listasTalles } = await obtenerListas();
  return (
    <>
      <Seccion
        titulo="Colores"
        descripcion="Una sola lista para todos tus productos. Se muestran en este orden en la tienda. Si le cambiás el nombre a uno, cambia en todos los productos que lo usan."
      >
        <div className="border bg-background p-4">
          <EditorValores
            nombre="color"
            placeholder="Ej. Negro"
            valores={colores}
            onGuardar={guardarColores}
          />
        </div>
      </Seccion>
      <Seccion
        titulo="Listas de talles"
        descripcion="Armá una por cada tipo de talle, por ejemplo una para ropa (S a XL) y otra para calzado (35 a 42). Cada producto usa una."
      >
        {listasTalles.map((lista) => (
          <ListaTalles
            key={lista.id}
            lista={lista}
            otras={listasTalles
              .filter((otra) => otra.id !== lista.id)
              .map((otra) => otra.nombre)}
          />
        ))}
        <NuevaLista existentes={listasTalles.map((lista) => lista.nombre)} />
      </Seccion>
    </>
  );
}

type SeccionProps = {
  titulo: string;
  descripcion: string;
  children: ReactNode;
};

function Seccion({ titulo, descripcion, children }: SeccionProps) {
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="text-sm font-bold tracking-wider uppercase">{titulo}</h2>
        <p className="text-sm text-muted-foreground">{descripcion}</p>
      </div>
      {children}
    </section>
  );
}

function Cargando() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
