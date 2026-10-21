import { EncabezadoPanel } from "@/components/encabezado-panel";
import { NavSecciones, type Seccion } from "@/components/nav-secciones";

const SECCIONES: Seccion[] = [
  { href: "/admin", texto: "Marcas", incluye: ["/admin/marcas"] },
  { href: "/admin/categorias", texto: "Categorías" },
  { href: "/admin/legales", texto: "Textos legales" },
];

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex flex-1 flex-col">
      <EncabezadoPanel>
        <NavSecciones secciones={SECCIONES} />
      </EncabezadoPanel>
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
