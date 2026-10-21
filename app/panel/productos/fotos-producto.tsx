"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useLayoutEffect, useState } from "react";
import { idsMovidos } from "@/components/botones-orden";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAccion } from "@/hooks/use-accion";
import { MAXIMO_FOTOS, type FotoProducto } from "@/lib/schemas/productos";
import { subirImagen } from "@/lib/subir-imagen";
import { cn } from "@/lib/utils";
import {
  ordenarFotos,
  pedirUrlDeFoto,
  quitarFoto,
  registrarFoto,
} from "./fotos-acciones";
import { ElegirFotos } from "./elegir-fotos";

type Props = { productoId: string; fotos: FotoProducto[] };

export function FotosProducto({ productoId, fotos }: Props) {
  const { pendiente, error, ejecutar } = useAccion();
  // Fuera de una transición: así el progreso se ve mientras sube.
  const [progreso, setProgreso] = useState<{ actual: number; total: number }>();
  const subiendo = progreso !== undefined;
  const [erroresSubida, setErroresSubida] = useState<string[]>([]);
  const [aQuitar, setAQuitar] = useState<FotoProducto>();
  const lugares = MAXIMO_FOTOS - fotos.length;
  const ocupado = pendiente || subiendo;

  useLayoutEffect(() => () => setErroresSubida([]), []);

  async function subir(archivos: File[]) {
    const elegidos = archivos.slice(0, lugares);
    const errores =
      archivos.length > lugares
        ? [`Solo entran ${lugares} más: el máximo es ${MAXIMO_FOTOS}.`]
        : [];
    setErroresSubida(errores);
    for (const [i, archivo] of elegidos.entries()) {
      setProgreso({ actual: i + 1, total: elegidos.length });
      const subida = await subirImagen(archivo, (datos) =>
        pedirUrlDeFoto(productoId, datos),
      );
      const resultado =
        "error" in subida ? subida : await registrarFoto(productoId, subida.url);
      if (resultado) errores.push(`${archivo.name}: ${resultado.error}`);
    }
    setProgreso(undefined);
    setErroresSubida([...errores]);
  }

  function mover(indice: number, desplazamiento: -1 | 1) {
    const ids = idsMovidos(
      fotos.map((foto) => foto.id),
      indice,
      desplazamiento,
    );
    ejecutar(() => ordenarFotos(productoId, ids));
  }

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-semibold">Fotos</h2>
        <p className="text-sm text-muted-foreground">
          {fotos.length} de {MAXIMO_FOTOS}
        </p>
      </div>

      <ul
        className={cn("grid grid-cols-3 gap-2", pendiente && "opacity-60")}
        aria-busy={ocupado}
      >
        {lugares > 0 && (
          <ElegirFotos
            disabled={ocupado}
            progreso={
              progreso && `Subiendo ${progreso.actual} de ${progreso.total}…`
            }
            onArchivos={subir}
          />
        )}
        {fotos.map((foto, i) => (
          <li
            key={foto.id}
            className="relative aspect-square overflow-hidden bg-muted"
          >
            <Image
              src={foto.urlMiniatura}
              alt={`Foto ${i + 1}`}
              fill
              unoptimized
              className="object-cover"
            />
            {i === 0 && (
              <span className="absolute top-1 left-1 bg-foreground px-1.5 py-0.5 text-[10px] font-semibold text-background uppercase">
                Principal
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-background/85">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={ocupado || i === 0}
                onClick={() => mover(i, -1)}
                aria-label={`Mover la foto ${i + 1} antes`}
              >
                <ChevronLeft />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={ocupado}
                onClick={() => setAQuitar(foto)}
                aria-label={`Quitar la foto ${i + 1}`}
              >
                <X />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={ocupado || i === fotos.length - 1}
                onClick={() => mover(i, 1)}
                aria-label={`Mover la foto ${i + 1} después`}
              >
                <ChevronRight />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {[...erroresSubida, ...(error ? [error] : [])].map((mensaje) => (
        <p key={mensaje} role="alert" className="text-sm text-destructive">
          {mensaje}
        </p>
      ))}

      <AlertDialog
        open={Boolean(aQuitar)}
        onOpenChange={(abierto) => !abierto && setAQuitar(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Quitar esta foto?</AlertDialogTitle>
            <AlertDialogDescription>
              Se borra del producto y no se puede recuperar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (aQuitar) ejecutar(() => quitarFoto(productoId, aQuitar.id));
              }}
            >
              Quitar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
