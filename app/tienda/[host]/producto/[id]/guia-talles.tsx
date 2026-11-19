"use client";

import { Ruler } from "lucide-react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function GuiaTalles({ url }: { url: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="-my-2 flex shrink-0 items-center gap-1.5 py-2 text-[13px] font-semibold underline-offset-4 hover:underline"
        >
          <Ruler className="size-4" />
          Guía de talles
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[85dvh] gap-0" aria-describedby={undefined}>
        <SheetHeader>
          <SheetTitle>Guía de talles</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto p-4">
          <Image
            src={url}
            alt="Tabla de medidas"
            width={1200}
            height={1600}
            unoptimized
            className="mx-auto h-auto w-full max-w-xl"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
