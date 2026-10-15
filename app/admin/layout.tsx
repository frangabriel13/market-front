import { BotonSalir } from "@/components/boton-salir";
import { NavAdmin } from "./nav-admin";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between gap-4 px-4">
          <p className="text-sm font-extrabold tracking-[0.2em] uppercase">
            {process.env.PLATFORM_NAME}
          </p>
          <BotonSalir />
        </div>
        <div className="mx-auto w-full max-w-2xl px-4">
          <NavAdmin />
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
