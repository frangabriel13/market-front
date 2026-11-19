"use client";

import "@/lib/zod-es";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { unstable_rethrow, useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { CampoLista } from "@/components/form/campo-lista";
import { CampoOpciones } from "@/components/form/campo-opciones";
import { CampoTexto } from "@/components/form/campo-texto";
import { IconoWhatsapp } from "@/components/iconos-redes";
import { ErrorFormulario } from "@/components/form/error-formulario";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useHidratado } from "@/hooks/use-hidratado";
import {
  agruparPorProducto,
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
  ETIQUETAS_FORMA_PAGO,
  FORMAS_PAGO,
  pedidoCrearSchema,
  type PedidoCrear,
  type PedidoCrearInput,
} from "@/lib/schemas/pedidos";
import type { MarcaTienda } from "@/lib/schemas/tienda";
import { descripcionVariante } from "@/lib/variantes";
import { RUTA_CARRITO, RUTA_PEDIDO_LISTO, RUTA_PRODUCTOS } from "../rutas";
import { crearPedido } from "./acciones";

type Props = { marca: MarcaTienda };

const OPCIONES_PAGO = FORMAS_PAGO.map((forma) => ({
  valor: forma,
  titulo: ETIQUETAS_FORMA_PAGO[forma],
}));

export function DatosPedido({ marca }: Props) {
  const items = useCarrito((carrito) => carrito.items);
  // Al enviar se vacía el carrito antes de llegar a la confirmación.
  const [enviado, setEnviado] = useState(false);
  useLayoutEffect(() => () => setEnviado(false), []);

  if (!useHidratado()) return <Skeleton className="h-40 w-full" />;
  if (enviado) {
    return (
      <p className="flex items-center gap-2 py-12 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Abriendo tu pedido…
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <SinPedido
        titulo="Tu pedido está vacío"
        volver={[RUTA_PRODUCTOS, "Ver productos"]}
      />
    );
  }
  if (totalDe(items) < marca.minimoCompra) {
    const minimo = formatearPrecio(marca.minimoCompra);
    return (
      <SinPedido
        titulo={`Tu pedido no llega a la compra mínima de ${minimo}`}
        volver={[RUTA_CARRITO, "Volver al pedido"]}
      />
    );
  }

  if (marca.opcionesEntrega.length === 0) {
    return (
      <p className="mx-auto max-w-sm py-16 text-center text-sm text-muted-foreground">
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
  titulo,
  volver: [href, textoLink],
}: {
  titulo: string;
  volver: [string, string];
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="titulo-seccion max-w-xs">{titulo}</p>
      <Button asChild>
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
      className="flex flex-col gap-8 md:grid md:grid-cols-[1fr_20rem] md:items-start md:gap-10"
    >
      <div className="flex flex-col gap-8 [&>section+section]:border-t [&>section+section]:pt-6">
        <section>
          <CampoOpciones
            control={form.control}
            name="opcionEntregaId"
            titulo="Entrega"
            opciones={opcionesEntrega(marca)}
            onElegir={(id) => {
              const opcion = marca.opcionesEntrega.find((o) => o.id === id);
              if (opcion) form.setValue("tipoEntrega", opcion.tipo);
            }}
          />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="titulo-seccion">Tus datos</h2>
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
            <h2 className="titulo-seccion">Datos para el envío</h2>
            <div className="grid grid-cols-2 gap-3">
              <CampoTexto
                control={form.control}
                name="dni"
                label="DNI"
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
            <div className="grid grid-cols-[1fr_7.5rem] gap-3">
              <CampoTexto
                control={form.control}
                name="localidad"
                label="Localidad"
                autoComplete="address-level2"
                maxLength={100}
              />
              <CampoTexto
                control={form.control}
                name="codigoPostal"
                label="Código postal"
                autoComplete="postal-code"
                maxLength={10}
              />
            </div>
            <CampoLista
              control={form.control}
              name="provincia"
              label="Provincia"
              placeholder="Elegí la provincia"
              opciones={PROVINCIAS}
              autoComplete="address-level1"
            />
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

        <section>
          <CampoOpciones
            control={form.control}
            name="formaPago"
            titulo="Forma de pago"
            descripcion="No pagás ahora: lo coordinás por WhatsApp con la marca."
            opciones={OPCIONES_PAGO}
            className="grid grid-cols-2"
          />
        </section>

        {sinStock.length > 0 ? (
          <div
            role="alert"
            className="flex flex-col gap-3 border-l-2 border-destructive bg-destructive/5 px-3 py-2.5 text-sm text-destructive"
          >
            <p className="font-bold">{error}:</p>
            <ul className="list-inside list-disc">
              {sinStock.map((item) => (
                <li key={`${item.productoId}|${item.color}|${item.talle}`}>
                  {item.nombre}
                  {descripcionVariante(item) &&
                    ` (${descripcionVariante(item)})`}
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
      {/* Celular: total y botón fijos abajo. Escritorio: resumen al costado. */}
      <div className="sticky bottom-0 z-10 -mx-4 flex flex-col gap-3 border-t bg-background px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:top-24 md:bottom-auto md:mx-0 md:border md:p-5">
        <div className="hidden items-baseline justify-between md:flex">
          <p className="titulo-seccion">Tu pedido</p>
          <Link
            href={RUTA_CARRITO}
            className="text-[13px] font-semibold underline underline-offset-4 hover:no-underline"
          >
            Cambiar
          </Link>
        </div>
        <ul className="hidden max-h-72 flex-col gap-3 overflow-y-auto md:flex">
          {agruparPorProducto(items).map((producto) => (
            <li key={producto.productoId} className="flex gap-3 text-[13px]">
              <span className="relative aspect-[3/4] w-12 shrink-0 overflow-hidden bg-muted">
                {producto.miniatura ? (
                  <Image
                    src={producto.miniatura}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <ImageIcon className="absolute inset-0 m-auto size-4 text-muted-foreground" />
                )}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-semibold">
                  {producto.nombre}
                </span>
                <span className="text-muted-foreground">
                  {unidadesDe(producto.items)} ×{" "}
                  {formatearPrecio(producto.precio)}
                </span>
              </span>
            </li>
          ))}
        </ul>
        <p className="flex items-baseline justify-between text-sm md:border-t md:pt-3">
          <span>
            Total · {unidades} {unidades === 1 ? "unidad" : "unidades"}
          </span>
          <strong className="text-2xl font-extrabold">
            {formatearPrecio(totalDe(items))}
          </strong>
        </p>
        <Button
          type="submit"
          size="lg"
          variant="success"
          disabled={form.formState.isSubmitting}
          className="h-auto min-h-12 py-3 whitespace-normal"
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

function opcionesEntrega(marca: MarcaTienda) {
  const retiro = [marca.direccionRetiro, marca.horariosRetiro]
    .filter(Boolean)
    .join(" · ");
  return marca.opcionesEntrega.map((opcion) => ({
    valor: opcion.id,
    titulo: opcion.nombre,
    detalle:
      opcion.tipo === "RETIRO" && retiro
        ? retiro
        : ETIQUETAS_TIPO_ENTREGA[opcion.tipo],
  }));
}
