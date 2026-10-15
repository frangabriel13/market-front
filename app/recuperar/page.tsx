import type { Metadata } from "next";
import { PantallaAuth } from "@/components/pantalla-auth";
import { RecuperarForm } from "./recuperar-form";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
};

export default function RecuperarPage() {
  return (
    <PantallaAuth
      titulo="Recuperá tu contraseña"
      descripcion="Te mandamos un link a tu email para que elijas una nueva."
    >
      <RecuperarForm />
    </PantallaAuth>
  );
}
