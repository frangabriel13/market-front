import { EncabezadoPanel } from "@/components/encabezado-panel";
import { NavSecciones, type Seccion } from "@/components/nav-secciones";

const SECCIONES: Seccion[] = [
  { href: "/panel", texto: "Productos", incluye: ["/panel/productos"] },
  { href: "/panel/pedidos", texto: "Pedidos" },
];

export default function PanelLayout({ children }: LayoutProps<"/panel">) {
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
