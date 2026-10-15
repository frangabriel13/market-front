import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api/error";
import { apiFetchConSesion } from "@/lib/api/con-sesion";
import type { Marca } from "@/lib/schemas/marcas";
import type { OpcionEntrega } from "@/lib/schemas/opciones-entrega";
import { AccesoFabricanteSeccion } from "../acceso-fabricante";
import { ImagenesMarca } from "../imagenes-marca";
import { MarcaForm } from "../marca-form";
import { OpcionesEntrega } from "../opciones-entrega";
import { VolverAMarcas } from "../volver";

export const metadata: Metadata = {
  title: "Editar marca",
};

export default function EditarMarcaPage({
  params,
}: PageProps<"/admin/marcas/[id]">) {
  return (
    <>
      <VolverAMarcas />
      <Suspense fallback={<EditarMarcaCargando />}>
        <EditarMarca params={params} />
      </Suspense>
    </>
  );
}

async function EditarMarca({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const marca = await obtenerMarca(id);
  const opciones = await apiFetchConSesion<OpcionEntrega[]>(
    `admin/marcas/${encodeURIComponent(id)}/opciones-entrega`,
  );
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">{marca.nombre}</h1>
      <ImagenesMarca marca={marca} />
      <AccesoFabricanteSeccion marca={marca} />
      <OpcionesEntrega marcaId={marca.id} opciones={opciones} />
      <MarcaForm marca={marca} dominio={process.env.PLATFORM_DOMAIN ?? ""} />
    </>
  );
}

async function obtenerMarca(id: string): Promise<Marca> {
  try {
    return await apiFetchConSesion<Marca>(
      `admin/marcas/${encodeURIComponent(id)}`,
    );
  } catch (error) {
    // La API responde 400 si el id no tiene formato válido.
    if (error instanceof ApiError && [400, 404].includes(error.status)) {
      notFound();
    }
    throw error;
  }
}

function EditarMarcaCargando() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      <Skeleton className="h-8 w-48" />
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}
