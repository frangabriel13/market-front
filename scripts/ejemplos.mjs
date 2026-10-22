// Carga productos y pedidos de ejemplo en la marca del fabricante, por la API.
// Uso: pnpm ejemplos            (carga)
//      pnpm ejemplos --borrar   (borra los productos de ejemplo; los pedidos quedan)
// Credenciales: FABRICANTE_EMAIL y FABRICANTE_PASSWORD, o las SEED_FABRICANTE_*
// de ../market-api/.env. La API sale de API_URL (.env.local).
import { readFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

const PRODUCTOS = [
  { nombre: "Remera Fuego", precio: 14000, categorias: ["mujer-remeras"], tono: [195, 65, 13] },
  { nombre: "Remera Lisa", precio: 5500, categorias: ["hombre-remeras"], tono: [230, 228, 222] },
  { nombre: "Musculosa Rib", precio: 6200, categorias: ["mujer-remeras"], tono: [40, 44, 52], agotada: true },
  { nombre: "Vestido Lino", precio: 23500, categorias: ["mujer-vestidos"], tono: [201, 182, 150] },
  { nombre: "Buzo Canguro", precio: 19500, categorias: ["hombre-buzos"], tono: [74, 93, 80] },
  { nombre: "Jogger Baggy", precio: 16800, categorias: ["hombre-pantalones"], tono: [60, 62, 70] },
  { nombre: "Pantalón Wide Leg", precio: 21000, categorias: ["mujer-pantalones"], tono: [120, 90, 70], oculto: true },
  { nombre: "Zapatilla Urbana", precio: 32000, categorias: ["calzado-zapatillas", "calzado"], tono: [245, 245, 245] },
];

const API_URL = process.env.API_URL;
if (!API_URL) salir("Falta API_URL (está en .env.local).");
const { email, password } = credenciales();
let token = "";
token = (await api("auth/login", { method: "POST", body: { email, password } })).accessToken;

if (process.argv.includes("--borrar")) {
  const nombres = new Set(PRODUCTOS.map((p) => p.nombre));
  for (const producto of await api("panel/productos")) {
    if (!nombres.has(producto.nombre)) continue;
    await api(`panel/productos/${producto.id}`, { method: "DELETE" });
    console.log(`Borrado: ${producto.nombre}`);
  }
  process.exit(0);
}

const [marca, categorias, existentes] = await Promise.all([
  api("panel/marca"),
  api("panel/categorias"),
  api("panel/productos"),
]);
if (marca.colores.length === 0 || marca.talles.length === 0) {
  salir("La marca no tiene colores y talles: cargalos desde el panel de administración.");
}
const hojas = categorias.flatMap((c) => (c.subcategorias.length ? c.subcategorias : [c]));
const colores = marca.colores.slice(0, 3);
const creados = [];

for (const [n, ejemplo] of PRODUCTOS.entries()) {
  const ya = existentes.find((p) => p.nombre === ejemplo.nombre);
  if (ya) {
    console.log(`Ya estaba: ${ejemplo.nombre}`);
    creados.push({ ...ejemplo, id: ya.id });
    continue;
  }
  const categoria =
    ejemplo.categorias.map((slug) => hojas.find((h) => h.slug === slug)).find(Boolean) ?? hojas[0];
  const { id } = await api("panel/productos", {
    method: "POST",
    body: {
      nombre: ejemplo.nombre,
      precio: ejemplo.precio,
      categoriaId: categoria.id,
      descripcion: "Producto de ejemplo.\nTela y corte de muestra.",
      visible: !ejemplo.oculto,
    },
  });
  for (const claro of [0, 40]) await subirFoto(id, ejemplo.tono.map((v) => Math.min(255, v + claro)));
  // Una combinación agotada por producto (todas, si es el de ejemplo agotado).
  const variantes = colores.flatMap((color, i) =>
    marca.talles.map((talle, j) => ({
      color,
      talle,
      disponible: !ejemplo.agotada && !(i === n % colores.length && j === marca.talles.length - 1),
    })),
  );
  await api(`panel/productos/${id}/variantes`, { method: "PUT", body: { variantes } });
  creados.push({ ...ejemplo, id });
  console.log(`Creado: ${ejemplo.nombre}`);
}

// Dos pedidos que llegan al mínimo, uno con retiro y otro con envío; solo la
// primera vez, para no repetirlos.
if (creados.every((p) => existentes.some((e) => e.id === p.id))) {
  console.log("\nLos productos ya estaban: no se crearon pedidos nuevos.");
  process.exit(0);
}
const host = marca.dominioPropio ?? `${marca.slug}.${process.env.PLATFORM_DOMAIN}`;
const tienda = await api("tienda", { headers: { "x-forwarded-host": host } });
const [primero, segundo] = creados.filter((p) => !p.oculto && !p.agotada);
for (const [producto, tipo] of [[primero, "RETIRO"], [segundo, "ENVIO"]]) {
  const opcion = tienda.opcionesEntrega.find((o) => o.tipo === tipo);
  if (!opcion) continue;
  const cantidad = Math.max(1, Math.ceil(tienda.minimoCompra / producto.precio));
  const { numero } = await api("tienda/pedidos", {
    method: "POST",
    headers: { "x-forwarded-host": host },
    body: {
      items: [{ productoId: producto.id, color: colores[1] ?? colores[0], talle: marca.talles[0], cantidad }],
      opcionEntregaId: opcion.id,
      tipoEntrega: tipo,
      nombre: tipo === "RETIRO" ? "Juan Pérez" : "Ana Gómez",
      telefono: "11 5555-5555",
      formaPago: tipo === "RETIRO" ? "EFECTIVO" : "TRANSFERENCIA",
      ...(tipo === "ENVIO" && {
        dni: "30123456",
        direccion: "San Martín 123",
        localidad: "Rosario",
        provincia: "Santa Fe",
        codigoPostal: "2000",
      }),
    },
  });
  console.log(`Pedido #${numero} (${opcion.nombre})`);
}
console.log(`\nListo. Tienda: http://${host}${host.endsWith("localhost") ? ":3000" : ""}`);

async function subirFoto(productoId, [r, g, b]) {
  const imagen = png(600, 750, (y) => {
    const sombra = 1 - (y / 750) * 0.25;
    return [r * sombra, g * sombra, b * sombra];
  });
  const { uploadUrl, url } = await api("panel/fotos", {
    method: "POST",
    body: { productoId, contentType: "image/png", tamanio: imagen.length },
  });
  const subida = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "content-type": "image/png" },
    body: imagen,
  });
  if (!subida.ok) salir(`No se pudo subir la foto (${subida.status}).`);
  await api(`panel/productos/${productoId}/fotos`, { method: "POST", body: { url } });
}

async function api(path, { body, headers, ...init } = {}) {
  const res = await fetch(new URL(path, API_URL), {
    ...init,
    headers: {
      accept: "application/json",
      ...(body && { "content-type": "application/json" }),
      ...(token && { authorization: `Bearer ${token}` }),
      ...headers,
    },
    body: body && JSON.stringify(body),
  });
  if (!res.ok) salir(`${init.method ?? "GET"} ${path}: ${res.status} ${await res.text()}`);
  return res.status === 204 ? undefined : res.json();
}

function credenciales() {
  const email = process.env.FABRICANTE_EMAIL;
  const password = process.env.FABRICANTE_PASSWORD;
  if (email && password) return { email, password };
  try {
    const env = Object.fromEntries(
      readFileSync(new URL("../../market-api/.env", import.meta.url), "utf8")
        .split("\n")
        .map((linea) => linea.match(/^(SEED_FABRICANTE_\w+)=(.*)$/))
        .filter(Boolean)
        .map(([, k, v]) => [k, v.trim()]),
    );
    if (env.SEED_FABRICANTE_EMAIL) {
      return { email: env.SEED_FABRICANTE_EMAIL, password: env.SEED_FABRICANTE_PASSWORD };
    }
  } catch {}
  salir("Pasá FABRICANTE_EMAIL y FABRICANTE_PASSWORD.");
}

// PNG de color liso con degradé vertical, sin dependencias.
function png(ancho, alto, colorDeFila) {
  const filas = Buffer.alloc((ancho * 3 + 1) * alto);
  for (let y = 0; y < alto; y++) {
    const [r, g, b] = colorDeFila(y).map(Math.round);
    const inicio = y * (ancho * 3 + 1);
    for (let x = 0; x < ancho; x++) filas.set([r, g, b], inicio + 1 + x * 3);
  }
  const cabecera = Buffer.alloc(13);
  cabecera.writeUInt32BE(ancho, 0);
  cabecera.writeUInt32BE(alto, 4);
  cabecera.set([8, 2, 0, 0, 0], 8);
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    bloque("IHDR", cabecera),
    bloque("IDAT", deflateSync(filas)),
    bloque("IEND", Buffer.alloc(0)),
  ]);
}

function bloque(tipo, datos) {
  const largo = Buffer.alloc(4);
  largo.writeUInt32BE(datos.length);
  const contenido = Buffer.concat([Buffer.from(tipo), datos]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(contenido));
  return Buffer.concat([largo, contenido, crc]);
}

function crc32(buffer) {
  let crc = ~0;
  for (const byte of buffer) {
    crc ^= byte;
    for (let k = 0; k < 8; k++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return ~crc >>> 0;
}

function salir(mensaje) {
  console.error(mensaje);
  process.exit(1);
}
