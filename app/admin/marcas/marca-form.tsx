"use client";

import "@/lib/zod-es";
import { zodResolver } from "@hookform/resolvers/zod";
import { unstable_rethrow } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch, type Path } from "react-hook-form";
import { CampoTexto } from "@/components/form/campo-texto";
import { ListaEditable } from "@/components/form/lista-editable";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  marcaCrearSchema,
  type Marca,
  type MarcaCrear,
  type MarcaCrearInput,
} from "@/lib/schemas/marcas";
import { formatearTelefono } from "@/lib/schemas/telefono";
import { slugify } from "@/lib/slugify";
import { crearMarca, editarMarca } from "./acciones";
import type { ErrorAccion } from "../errores";
import { TextosBanner } from "./textos-banner";

type Props = { marca?: Marca; dominio: string };

const REDES = [
  { nombre: "instagram", label: "Instagram", placeholder: "https://instagram.com/…" },
  { nombre: "facebook", label: "Facebook", placeholder: "https://facebook.com/…" },
  { nombre: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@…" },
] as const;

function valoresIniciales(marca?: Marca): MarcaCrearInput {
  return {
    nombre: marca?.nombre ?? "",
    slug: marca?.slug ?? "",
    whatsapp: marca ? formatearTelefono(marca.whatsapp) : "",
    minimoCompra: marca?.minimoCompra ?? 0,
    comoComprar: marca?.comoComprar ?? "",
    condicionesVenta: marca?.condicionesVenta ?? "",
    direccionRetiro: marca?.direccionRetiro ?? "",
    horariosRetiro: marca?.horariosRetiro ?? "",
    textosBanner: marca?.textosBanner ?? [],
    redes: {
      instagram: marca?.redes.instagram ?? "",
      facebook: marca?.redes.facebook ?? "",
      tiktok: marca?.redes.tiktok ?? "",
    },
    colores: marca?.colores ?? [],
    talles: marca?.talles ?? [],
  };
}

export function MarcaForm({ marca, dominio }: Props) {
  const form = useForm<MarcaCrearInput, unknown, MarcaCrear>({
    resolver: zodResolver(marcaCrearSchema),
    defaultValues: valoresIniciales(marca),
  });
  const { control, formState } = form;
  const [guardado, setGuardado] = useState(false);
  const slug = useWatch({ control, name: "slug" });

  // Al crear, el slug sigue al nombre hasta que se edita a mano.
  const slugEditado = useRef(Boolean(marca));
  useEffect(
    () =>
      form.subscribe({
        name: ["nombre", "slug"],
        formState: { values: true },
        callback: ({ values, name, type }) => {
          if (name === "slug" && type === "change") slugEditado.current = true;
          if (name === "nombre" && !slugEditado.current) {
            form.setValue("slug", slugify(values.nombre));
          }
        },
      }),
    [form],
  );

  // Next oculta la página al navegar sin desmontarla: después de guardar, que
  // al volver no aparezcan el aviso viejo ni (al crear) los datos anteriores.
  const reiniciarAlOcultar = useRef(false);
  const esNueva = !marca;
  useLayoutEffect(
    () => () => {
      if (!reiniciarAlOcultar.current) return;
      reiniciarAlOcultar.current = false;
      setGuardado(false);
      if (esNueva) {
        form.reset(valoresIniciales());
        slugEditado.current = false;
      }
    },
    [form, esNueva],
  );

  function mostrarError({ error, campos }: ErrorAccion) {
    reiniciarAlOcultar.current = false;
    form.setError("root", { message: error });
    for (const [campo, mensaje] of Object.entries(campos ?? {})) {
      form.setError(campo as Path<MarcaCrearInput>, { message: mensaje });
    }
  }

  async function onSubmit(datos: MarcaCrear) {
    setGuardado(false);
    reiniciarAlOcultar.current = true;
    try {
      const error = marca
        ? await editarMarca(marca.id, datos)
        : await crearMarca(datos);
      if (error) return mostrarError(error);
      form.reset(form.getValues());
      setGuardado(true);
    } catch (error) {
      unstable_rethrow(error);
      mostrarError({ error: "No pudimos guardar la marca. Probá de nuevo." });
    }
  }

  return (
    <form
      noValidate
      onSubmit={(evento) => form.handleSubmit(onSubmit)(evento)}
      className="flex flex-col gap-8"
    >
      <FieldSet>
        <FieldLegend>Datos de la marca</FieldLegend>
        <FieldGroup>
          <CampoTexto
            control={control}
            name="nombre"
            label="Nombre"
            maxLength={80}
          />
          <CampoTexto
            control={control}
            name="slug"
            label="Dirección de la tienda"
            maxLength={60}
            autoCapitalize="none"
            spellCheck={false}
            descripcion={
              <>
                Queda en{" "}
                <span className="font-medium text-foreground">
                  {slug || "tu-marca"}.{dominio}
                </span>
                {marca && ". Si la cambiás, el link anterior deja de funcionar."}
              </>
            }
          />
          <CampoTexto
            control={control}
            name="whatsapp"
            label="WhatsApp"
            type="tel"
            inputMode="tel"
            autoComplete="off"
            descripcion="Acá llegan los pedidos. Con característica, ej. 11 5555-5555."
          />
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Venta</FieldLegend>
        <FieldGroup>
          <Controller
            control={control}
            name="minimoCompra"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="minimoCompra">Mínimo de compra</FieldLabel>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="minimoCompra"
                    inputMode="numeric"
                    maxLength={11}
                    className="pl-7"
                    value={field.value?.toLocaleString("es-AR") ?? ""}
                    onChange={(e) => {
                      const digitos = e.target.value.replace(/\D/g, "");
                      field.onChange(digitos ? Number(digitos) : undefined);
                    }}
                    onBlur={field.onBlur}
                    aria-invalid={fieldState.invalid}
                  />
                </div>
                <FieldDescription>Con 0 no hay mínimo.</FieldDescription>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <CampoTexto
            control={control}
            name="comoComprar"
            label="Cómo comprar"
            multilinea
            maxLength={5000}
          />
          <CampoTexto
            control={control}
            name="condicionesVenta"
            label="Condiciones de venta"
            multilinea
            maxLength={5000}
          />
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Retiro en el local</FieldLegend>
        <FieldDescription>
          Dejalo vacío si la marca no tiene retiro.
        </FieldDescription>
        <FieldGroup>
          <CampoTexto
            control={control}
            name="direccionRetiro"
            label="Dirección"
            maxLength={200}
          />
          <CampoTexto
            control={control}
            name="horariosRetiro"
            label="Horarios"
            maxLength={200}
          />
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Banner del inicio</FieldLegend>
        <FieldDescription>Hasta 3 textos cortos para el inicio de la tienda.</FieldDescription>
        <Controller
          control={control}
          name="textosBanner"
          render={({ field }) => (
            <TextosBanner
              value={field.value ?? []}
              onChange={field.onChange}
              errores={formState.errors.textosBanner}
            />
          )}
        />
      </FieldSet>

      <FieldSet>
        <FieldLegend>Redes</FieldLegend>
        <FieldGroup>
          {REDES.map(({ nombre, label, placeholder }) => (
            <CampoTexto
              key={nombre}
              control={control}
              name={`redes.${nombre}`}
              label={label}
              type="url"
              autoCapitalize="none"
              placeholder={placeholder}
            />
          ))}
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Colores y talles</FieldLegend>
        <FieldDescription>
          El fabricante elige de estas listas al cargar cada producto. Los talles
          se muestran en el orden en que los agregues.
        </FieldDescription>
        <FieldGroup>
          {(["colores", "talles"] as const).map((nombre) => (
            <Controller
              key={nombre}
              control={control}
              name={nombre}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={nombre}>
                    {nombre === "colores" ? "Colores" : "Talles"}
                  </FieldLabel>
                  <ListaEditable
                    id={nombre}
                    value={field.value ?? []}
                    onChange={field.onChange}
                    maxLength={30}
                    placeholder={nombre === "colores" ? "Ej. Negro" : "Ej. M"}
                    invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          ))}
        </FieldGroup>
      </FieldSet>

      <div className="sticky bottom-0 -mx-4 flex flex-col gap-2 border-t bg-background px-4 py-3">
        {formState.errors.root && (
          <p role="alert" className="text-sm text-destructive">
            {formState.errors.root.message}
          </p>
        )}
        {guardado && !formState.isDirty && (
          <p role="status" className="text-sm text-success">
            Guardamos los cambios.
          </p>
        )}
        <Button type="submit" size="lg" disabled={formState.isSubmitting}>
          {formState.isSubmitting
            ? "Guardando…"
            : marca
              ? "Guardar cambios"
              : "Crear marca"}
        </Button>
      </div>
    </form>
  );
}
