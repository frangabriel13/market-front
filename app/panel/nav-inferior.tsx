import { House, LayoutGrid, ReceiptText } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { urlDeTienda } from "@/lib/url-tienda";
import { cn } from "@/lib/utils";
import { obtenerMarca } from "./productos/datos";

type Seccion = "pedidos" | "productos";

const ITEM =
  "flex flex-col items-center justify-center gap-1 border-t-2 py-2 text-xs font-semibold";

export function NavInferior({ actual }: { actual: Seccion }) {
  const clase = (seccion: Seccion) =>
    cn(
      ITEM,
      seccion === actual
        ? "border-foreground text-foreground"
        : "border-transparent text-muted-foreground",
    );
  return (
    <nav
      aria-label="Secciones"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t bg-background pb-[env(safe-area-inset-bottom)]"
    >
      <Link
        href="/panel/pedidos"
        aria-current={actual === "pedidos" ? "page" : undefined}
        className={clase("pedidos")}
      >
        <ReceiptText className="size-5" />
        Pedidos
      </Link>
      <Link
        href="/panel"
        aria-current={actual === "productos" ? "page" : undefined}
        className={clase("productos")}
      >
        <LayoutGrid className="size-5" />
        Productos
      </Link>
      <Suspense fallback={<span className={cn(ITEM, "border-transparent")} />}>
        <MiPagina />
      </Suspense>
    </nav>
  );
}

// La tienda se abre aparte para no perder el panel.
async function MiPagina() {
  const marca = await obtenerMarca();
  return (
    <a
      href={urlDeTienda(marca)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(ITEM, "border-transparent text-muted-foreground")}
    >
      <House className="size-5" />
      Mi página
    </a>
  );
}
