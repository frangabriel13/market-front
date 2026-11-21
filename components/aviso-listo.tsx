import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

// Confirmación de que algo salió bien (link enviado, contraseña guardada).
export function AvisoListo({
  Icono,
  children,
}: {
  Icono: LucideIcon;
  children: ReactNode;
}) {
  return (
    <p
      role="status"
      className="flex gap-2.5 border-l-2 border-success bg-success/5 px-3 py-3 text-sm"
    >
      <Icono className="mt-0.5 size-4 shrink-0 text-success" />
      <span>{children}</span>
    </p>
  );
}
