import type { ReactNode } from "react";

export function ErrorFormulario({ children }: { children: ReactNode }) {
  return (
    <p
      role="alert"
      className="border-l-2 border-destructive bg-destructive/5 px-3 py-2.5 text-sm text-destructive"
    >
      {children}
    </p>
  );
}
