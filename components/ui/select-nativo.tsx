import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { clasesCampo } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Select del sistema (en el celular abre su selector) con el aspecto de los
// campos de texto.
export function SelectNativo({ className, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(`h-11 appearance-none pr-10 pl-3 ${clasesCampo}`, className)}
        {...props}
      />
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
