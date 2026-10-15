import type { Metadata } from "next";
import { PantallaAuth } from "@/components/pantalla-auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Ingresar",
};

export default function LoginPage() {
  return (
    <PantallaAuth
      titulo="Ingresá a tu cuenta"
      descripcion="Usá el email y la contraseña de tu panel."
    >
      <LoginForm />
    </PantallaAuth>
  );
}
