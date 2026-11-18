import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cerrarSesion } from "@/lib/acciones/sesion";
import { cn } from "@/lib/utils";

export function BotonSalir({ sobreOscuro }: { sobreOscuro?: boolean }) {
  return (
    <form action={cerrarSesion}>
      <Button
        type="submit"
        variant="outline"
        size="sm"
        className={cn(
          sobreOscuro &&
            "border-background/40 bg-transparent text-background hover:bg-background/10",
        )}
      >
        <LogOut />
        Salir
      </Button>
    </form>
  );
}
