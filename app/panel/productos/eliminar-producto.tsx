"use client";

import { Trash2 } from "lucide-react";
import { unstable_rethrow } from "next/navigation";
import { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { eliminarProducto } from "./acciones";

type Props = { productoId: string; nombre: string };

export function EliminarProducto({ productoId, nombre }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [pendiente, startTransition] = useTransition();
  const [error, setError] = useState<string>();

  function eliminar() {
    setError(undefined);
    startTransition(async () => {
      try {
        const resultado = await eliminarProducto(productoId);
        setError(resultado.error);
      } catch (e) {
        // Si sale bien, la acción redirige al listado (llega como error).
        unstable_rethrow(e);
        setError("No pudimos eliminar el producto. Probá de nuevo.");
      }
    });
  }

  return (
    <AlertDialog
      open={abierto}
      onOpenChange={(valor) => {
        setAbierto(valor);
        if (!valor) setError(undefined);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="mt-10 self-start">
          <Trash2 />
          Eliminar producto
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar {nombre}?</AlertDialogTitle>
          <AlertDialogDescription>
            Se borra con sus fotos y no se puede recuperar. Los pedidos que ya
            lo incluyen no cambian.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pendiente}>Cancelar</AlertDialogCancel>
          <Button variant="destructive" disabled={pendiente} onClick={eliminar}>
            {pendiente ? "Eliminando…" : "Eliminar"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
