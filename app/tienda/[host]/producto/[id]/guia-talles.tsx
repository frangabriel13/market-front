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
          className="flex w-full items-center justify-between border-b py-3 text-sm font-bold tracking-wider uppercase"
        >
          Guía de talles
          <Ruler className="size-4" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[85dvh] gap-0" aria-describedby={undefined}>
        <SheetHeader className="border-b">
          <SheetTitle className="font-bold uppercase">Guía de talles</SheetTitle>
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
