import * as React from "react"
import { cn } from "cn"
import { clasesCampo } from "@/components/ui/input"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        `flex field-sizing-content min-h-20 px-3 py-2.5 leading-relaxed ${clasesCampo}`,
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
