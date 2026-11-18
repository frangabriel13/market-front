import * as React from "react"
import { cn } from "cn"

// Borde, foco y error comunes a los campos de texto y los select.
export const clasesCampo =
  "w-full min-w-0 border border-input bg-background text-base text-foreground transition-colors outline-none placeholder:text-muted-foreground hover:border-foreground/60 focus-visible:border-foreground focus-visible:ring-1 focus-visible:ring-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive md:text-sm"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        `h-11 px-3 py-1 file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground ${clasesCampo}`,
        className
      )}
      {...props}
    />
  )
}

export { Input }
