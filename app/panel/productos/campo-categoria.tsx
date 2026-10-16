"use client";

import { useId } from "react";
import { Controller, type Control } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import type { CategoriaConSubcategorias } from "@/lib/schemas/categorias";
import type {
  ProductoCrear,
  ProductoCrearInput,
} from "@/lib/schemas/productos";

type Props = {
  control: Control<ProductoCrearInput, unknown, ProductoCrear>;
  categorias: CategoriaConSubcategorias[];
};

// Con el nombre del padre: hay subcategorías que se repiten (Mujer › Remeras,
// Hombre › Remeras) y el select cerrado solo muestra la opción elegida.
function opciones(categorias: CategoriaConSubcategorias[]) {
  return categorias.flatMap((categoria) =>
    categoria.subcategorias.length > 0
      ? categoria.subcategorias.map((sub) => ({
          id: sub.id,
          texto: `${categoria.nombre} › ${sub.nombre}`,
        }))
      : [{ id: categoria.id, texto: categoria.nombre }],
  );
}

// Select nativo: en el celular abre el selector del sistema.
export function CampoCategoria({ control, categorias }: Props) {
  const id = useId();
  return (
    <Controller
      control={control}
      name="categoriaId"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>Categoría</FieldLabel>
          <select
            {...field}
            id={id}
            aria-invalid={fieldState.invalid}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive md:text-sm"
          >
            <option value="" disabled>
              Elegí una categoría
            </option>
            {opciones(categorias).map(({ id: opcionId, texto }) => (
              <option key={opcionId} value={opcionId}>
                {texto}
              </option>
            ))}
          </select>
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}
