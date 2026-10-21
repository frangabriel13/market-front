"use client";

import "@/lib/zod-es";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { unstable_rethrow, useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { Controller, useForm, useWatch, type Control } from "react-hook-form";
import { CampoLista } from "@/components/form/campo-lista";
import { CampoTexto } from "@/components/form/campo-texto";
import { IconoWhatsapp } from "@/components/iconos-redes";
import { ErrorFormulario } from "@/components/form/error-formulario";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useHidratado } from "@/hooks/use-hidratado";
import {
  totalDe,
  unidadesDe,
  useCarrito,
  type ItemCarrito,
  type Variante,
} from "@/lib/carrito";
import { formatearPrecio } from "@/lib/formato";
import { guardarPedidoArmado } from "@/lib/pedido-armado";
import { PROVINCIAS } from "@/lib/provincias";
import { ETIQUETAS_TIPO_ENTREGA } from "@/lib/schemas/opciones-entrega";
import {
  pedidoCrearSchema,
  type PedidoCrear,
  type PedidoCrearInput,
} from "@/lib/schemas/pedidos";
import type { MarcaTienda } from "@/lib/schemas/tienda";
import { cn } from "@/lib/utils";
import { RUTA_CARRITO, RUTA_PEDIDO_LISTO } from "../rutas";
import { crearPedido } from "./acciones";

type Props = { marca: MarcaTienda };


export function DatosPedido({ marca }: Props) {
  const items = useCarrito((carrito) => carrito.items);
  // Al enviar se vacía el carrito antes de llegar a la confirmación.
  const [enviado, setEnviado] = useState(false);
  useLayoutEffect(() => () => setEnviado(false), []);

  if (!useHidratado()) return <Skeleton className="h-40 w-full" />;
  if (enviado) {
    return <p className="text-sm text-muted-foreground">Abriendo tu pedido…</p>;
  }

  if (items.length === 0) {
    return <SinPedido texto="Tu pedido está vacío." volver={["/", "Ver productos"]} />;
  }
  if (totalDe(items) < marca.minimoCompra) {
    const minimo = formatearPrecio(marca.minimoCompra);
    return (
      <SinPedido
        texto={`Tu pedido no llega a la compra mínima de ${minimo}.`}
        volver={[RUTA_CARRITO, "Volver al pedido"]}
      />
    );
  }

  if (marca.opcionesEntrega.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        Esta tienda todavía no tiene formas de entrega. Escribile por WhatsApp
        para hacer tu pedido.
      </p>
    );
  }

  return (
    <FormularioPedido
      marca={marca}
      items={items}
      onEnviado={() => setEnviado(true)}
    />
  );
}

function SinPedido({
  texto,
  volver: [href, textoLink],
}: {
  texto: string;
  volver: [string, string];
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <p className="text-sm text-muted-foreground">{texto}</p>
      <Button asChild variant="outline">
        <Link href={href}>{textoLink}</Link>
      </Button>
    </div>
  );
}

function FormularioPedido({
  marca,
  items,
  onEnviado,
}: Props & { items: ItemCarrito[]; onEnviado: () => void }) {
  const router = useRouter();
  const vaciar = useCarrito((carrito) => carrito.vaciar);
  const quitar = useCarrito((carrito) => carrito.quitar);
  const [unica] =
    marca.opcionesEntrega.length === 1 ? marca.opcionesEntrega : [];
  const form = useForm<PedidoCrearInput, unknown, PedidoCrear>({
    resolver: zodResolver(pedidoCrearSchema),
    defaultValues: {
      items: [],
      opcionEntregaId: unica?.id ?? "",
      tipoEntrega: unica?.tipo,
      nombre: "",
      telefono: "",
    },
  });
  const tipoEntrega = useWatch({ control: form.control, name: "tipoEntrega" });
  const [error, setError] = useState<string>();
  const [noDisponibles, setNoDisponibles] = useState<Variante[]>([]);

  async function enviar(datos: PedidoCrear) {
    setError(undefined);
    setNoDisponibles([]);
    try {
      const resultado = await crearPedido(datos);
      if ("pedido" in resultado) {
        guardarPedidoArmado(resultado.pedido);
        onEnviado();
        vaciar();
        router.replace(RUTA_PEDIDO_LISTO);
        return;
      }
      setError(resultado.error);
      setNoDisponibles(resultado.noDisponibles ?? []);
      for (const [campo, mensaje] of Object.entries(resultado.campos ?? {})) {
        form.setError(campo as keyof PedidoCrearInput, { message: mensaje });
      }
    } catch (e) {
      unstable_rethrow(e);
      setError("No pudimos armar el pedido. Probá de nuevo.");
    }
  }

  const sinStock = items.filter((item) =>
    noDisponibles.some(
      (v) =>
        v.productoId === item.productoId &&
        v.color === item.color &&
        v.talle === item.talle,
    ),
  );
  const unidades = unidadesDe(items);

  return (
    <form
      noValidate
      onSubmit={(evento) => {
        form.setValue(
          "items",
          items.map(({ productoId, color, talle, cantidad }) => ({
            productoId,
            color,
            talle,
            cantidad,
          })),
        );
        return form.handleSubmit(enviar)(evento);
      }}
      className="flex flex-col gap-8"
    >
      <ElegirEntrega
        control={form.control}
        marca={marca}
        onTipo={(tipo) => form.setValue("tipoEntrega", tipo)}
      />

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-bold tracking-wider uppercase">Tus datos</h2>
        <CampoTexto
          control={form.control}
          name="nombre"
          label="Nombre completo"
          autoComplete="name"
          maxLength={80}
        />
        <CampoTexto
          control={form.control}
          name="telefono"
          label="Celular"
          descripcion="Con característica. Te escriben por WhatsApp a este número."
          type="tel"
          inputMode="tel"
          autoComplete="tel"
        />
      </section>

      {tipoEntrega === "ENVIO" && (
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-bold tracking-wider uppercase">
            Datos para el envío
          </h2>
          {/* TODO(decision): DNI y CUIT opcionales en envío; el DNI pasa a obligatorio en la 5.14. */}
          <div className="grid grid-cols-2 gap-3">
            <CampoTexto
              control={form.control}
              name="dni"
              label="DNI (opcional)"
              inputMode="numeric"
            />
            <CampoTexto
              control={form.control}
              name="cuit"
              label="CUIT (opcional)"
              inputMode="numeric"
            />
          </div>
          <CampoTexto
            control={form.control}
            name="direccion"
            label="Dirección"
            descripcion="Calle y altura. Si hace falta, piso y depto."
            autoComplete="street-address"
            maxLength={200}
          />
          <div className="grid grid-cols-2 gap-3">
            <CampoTexto
              control={form.control}
              name="localidad"
              label="Localidad"
              autoComplete="address-level2"
              maxLength={100}
            />
            <CampoLista
              control={form.control}
              name="provincia"
              label="Provincia"
              placeholder="Elegí"
              opciones={PROVINCIAS}
              autoComplete="address-level1"
            />
          </div>
          <CampoTexto
            control={form.control}
            name="transporte"
            label="Expreso o agencia (opcional)"
            placeholder="El transporte que prefieras"
            maxLength={100}
          />
          <CampoTexto
            control={form.control}
            name="observaciones"
            label="Notas del pedido (opcional)"
            multilinea
            maxLength={500}
          />
        </section>
      )}

      <div className="flex flex-col gap-3">
        {sinStock.length > 0 ? (
          <div
            role="alert"
            className="flex flex-col gap-3 border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive"
          >
            <p className="font-bold">{error}:</p>
            <ul className="list-inside list-disc">
              {sinStock.map((item) => (
                <li key={`${item.productoId}|${item.color}|${item.talle}`}>
                  {item.nombre} ({item.color} / {item.talle})
                </li>
              ))}
            </ul>
            <Button
              type="button"
              variant="outline"
              className="self-start"
              onClick={() => {
                sinStock.forEach(quitar);
                setError(undefined);
                setNoDisponibles([]);
              }}
            >
              Quitarlos del pedido
            </Button>
          </div>
        ) : (
          error && <ErrorFormulario>{error}</ErrorFormulario>
        )}
      </div>
      <div className="sticky bottom-0 flex flex-col gap-3 border-t bg-background py-4">
        <p className="flex items-baseline justify-between">
          <span>
            {unidades} {unidades === 1 ? "unidad" : "unidades"}
          </span>
          <strong className="text-2xl font-black">
            {formatearPrecio(totalDe(items))}
          </strong>
        </p>
        <Button
          type="submit"
          size="lg"
          variant="success"
          disabled={form.formState.isSubmitting}
        >
          <IconoWhatsapp />
          {form.formState.isSubmitting
            ? "Armando tu pedido…"
            : "Enviar pedido por WhatsApp"}
        </Button>
      </div>
    </form>
  );
}

function ElegirEntrega({
  control,
  marca,
  onTipo,
}: Props & {
  control: Control<PedidoCrearInput, unknown, PedidoCrear>;
  onTipo: (tipo: PedidoCrearInput["tipoEntrega"]) => void;
}) {
  const retiro = [marca.direccionRetiro, marca.horariosRetiro]
    .filter(Boolean)
    .join(" · ");
  return (
    <Controller
      control={control}
      name="opcionEntregaId"
      render={({ field, fieldState }) => (
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-bold tracking-wider uppercase">
            Entrega
          </legend>
          {marca.opcionesEntrega.map((opcion) => (
            <label
              key={opcion.id}
              className={cn(
                "flex cursor-pointer items-start gap-3 border p-3 text-sm",
                field.value === opcion.id
                  ? "border-2 border-foreground"
                  : "border-input",
              )}
            >
              <input
                type="radio"
                name={field.name}
                value={opcion.id}
                checked={field.value === opcion.id}
                onChange={() => {
                  field.onChange(opcion.id);
                  onTipo(opcion.tipo);
                }}
                className="mt-0.5 accent-foreground"
              />
              <span className="flex flex-col gap-0.5">
                <span className="font-bold">{opcion.nombre}</span>
                <span className="text-muted-foreground">
                  {opcion.tipo === "RETIRO" && retiro
                    ? retiro
                    : ETIQUETAS_TIPO_ENTREGA[opcion.tipo]}
                </span>
              </span>
            </label>
          ))}
          {fieldState.error && (
            <p className="text-sm text-destructive">{fieldState.error.message}</p>
          )}
        </fieldset>
      )}
    />
  );
}
