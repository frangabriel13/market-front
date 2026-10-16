import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ListaProductos, ListaProductosCargando } from "./lista-productos";

export const metadata: Metadata = {
  title: "Productos",
};

export default function PanelPage() {
  return (
    <>
      <div className="mb-1 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Button asChild>
          <Link href="/panel/productos/nuevo">
            <Plus />
            Nuevo producto
          </Link>
        </Button>
      </div>
      <Suspense fallback={<ListaProductosCargando />}>
        <ListaProductos />
      </Suspense>
    </>
  );
}
