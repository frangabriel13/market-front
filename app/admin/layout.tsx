import { EncabezadoPanel } from "@/components/encabezado-panel";
import { NavAdmin } from "./nav-admin";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex flex-1 flex-col">
      <EncabezadoPanel>
        <NavAdmin />
      </EncabezadoPanel>
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
