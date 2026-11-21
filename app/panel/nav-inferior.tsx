import { ExternalLink, LayoutGrid, ReceiptText } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { urlDeTienda } from "@/lib/url-tienda";
import { cn } from "@/lib/utils";
import { obtenerMarca } from "./productos/datos";

type Seccion = "pedidos" | "productos";

const ITEM =
  "-mt-px flex h-15 flex-col items-center justify-center gap-1 border-t-2 text-[11px] font-semibold transition-colors";

export function NavInferior({ actual }: { actual: Seccion }) {
  const clase = (seccion: Seccion) =>
    cn(
      ITEM,
      seccion === actual
        ? "border-foreground text-foreground"
        : "border-transparent text-muted-foreground hover:text-foreground",
    );
  return (
    <nav
      aria-label="Secciones"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto grid max-w-2xl grid-cols-3">
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
        <Suspense
          fallback={<span className={cn(ITEM, "border-transparent")} />}
        >
          <MiPagina />
        </Suspense>
      </div>
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
      className={cn(
        ITEM,
        "border-transparent text-muted-foreground hover:text-foreground",
      )}
    >
      <ExternalLink className="size-5" />
      Mi página
    </a>
  );
}
