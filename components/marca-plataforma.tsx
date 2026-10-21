// Franja oscura con el nombre de la plataforma, como el encabezado de la tienda.
export function MarcaPlataforma({ children }: { children?: React.ReactNode }) {
  return (
    <div className="bg-foreground text-background">
      <div className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between gap-4 px-4">
        <p className="text-xl font-black tracking-wider uppercase italic">
          {process.env.PLATFORM_NAME}
        </p>
        {children}
      </div>
    </div>
  );
}
