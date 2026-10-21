import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ListaMarcas, ListaMarcasCargando } from "./lista-marcas";

export const metadata: Metadata = {
  title: "Marcas",
};

export default function AdminPage() {
  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-black">Marcas</h1>
        <Button asChild>
          <Link href="/admin/marcas/nueva">
            <Plus />
            Nueva marca
          </Link>
        </Button>
      </div>
      <Suspense fallback={<ListaMarcasCargando />}>
        <ListaMarcas />
      </Suspense>
    </>
  );
}
