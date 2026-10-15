import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Ingresar",
};

export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-12 sm:justify-center">
      <div className="w-full max-w-sm">
        <p className="text-center text-lg font-extrabold tracking-[0.2em] uppercase">
          {process.env.PLATFORM_NAME}
        </p>

        <h1 className="mt-10 text-2xl font-bold">Ingresá a tu cuenta</h1>
        <p className="mt-1 mb-8 text-sm text-muted-foreground">
          Usá el email y la contraseña de tu panel.
        </p>

        <LoginForm />
      </div>
    </main>
  );
}
