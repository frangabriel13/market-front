"use client";

import { Loader2, MoreVertical } from "lucide-react";
import { useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAccion } from "@/hooks/use-accion";
import type { EstadoMarca, MarcaResumen } from "@/lib/schemas/marcas";
import { cambiarEstadoMarca } from "./acciones";

export function MarcaAcciones({ marca }: { marca: MarcaResumen }) {
  const { pendiente, error, ejecutar } = useAccion();
  const [confirmarBaja, setConfirmarBaja] = useState(false);

  function cambiarEstado(estado: EstadoMarca) {
    ejecutar(() => cambiarEstadoMarca(marca.id, estado));
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={pendiente}
            aria-label={`Acciones de ${marca.nombre}`}
          >
            {pendiente ? <Loader2 className="animate-spin" /> : <MoreVertical />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {marca.estado === "ACTIVA" ? (
            <DropdownMenuItem onSelect={() => cambiarEstado("PAUSADA")}>
              Pausar tienda
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onSelect={() => cambiarEstado("ACTIVA")}>
              Reactivar tienda
            </DropdownMenuItem>
          )}
          {marca.estado !== "BAJA" && (
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => setConfirmarBaja(true)}
            >
              Dar de baja
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmarBaja} onOpenChange={setConfirmarBaja}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Dar de baja {marca.nombre}?</AlertDialogTitle>
            <AlertDialogDescription>
              La tienda deja de estar disponible para los compradores. Podés
              reactivarla más adelante.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => cambiarEstado("BAJA")}
            >
              Dar de baja
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {error && (
        <p role="alert" className="col-span-full text-sm text-destructive">
          {error}
        </p>
      )}
    </>
  );
}
