import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cerrarSesion } from "@/lib/acciones/sesion";

export function BotonSalir() {
  return (
    <form action={cerrarSesion}>
      <Button type="submit" variant="outline" size="sm">
        <LogOut />
        Salir
      </Button>
    </form>
  );
}
