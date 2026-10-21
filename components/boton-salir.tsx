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
            "border-white/30 bg-transparent text-background hover:bg-white/10 hover:text-background",
        )}
      >
        <LogOut />
        Salir
      </Button>
    </form>
  );
}
