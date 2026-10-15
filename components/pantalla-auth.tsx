import type { ReactNode } from "react";

type Props = { titulo: string; descripcion?: ReactNode; children: ReactNode };

export function PantallaAuth({ titulo, descripcion, children }: Props) {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-12 sm:justify-center">
      <div className="w-full max-w-sm">
        <p className="text-center text-lg font-extrabold tracking-[0.2em] uppercase">
          {process.env.PLATFORM_NAME}
        </p>
        <h1 className="mt-10 text-2xl font-bold">{titulo}</h1>
        {descripcion && (
          <p className="mt-1 text-sm text-muted-foreground">{descripcion}</p>
        )}
        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}
