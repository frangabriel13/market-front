"use client";

import { useId } from "react";
import { Controller, type Control } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { SelectNativo } from "@/components/ui/select-nativo";
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

export function CampoCategoria({ control, categorias }: Props) {
  const id = useId();
  return (
    <Controller
      control={control}
      name="categoriaId"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>Categoría</FieldLabel>
          <SelectNativo
            {...field}
            id={id}
            aria-invalid={fieldState.invalid}
            >
            <option value="" disabled>
              Elegí una categoría
            </option>
            {opciones(categorias).map(({ id: opcionId, texto }) => (
              <option key={opcionId} value={opcionId}>
                {texto}
              </option>
            ))}
          </SelectNativo>
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}
