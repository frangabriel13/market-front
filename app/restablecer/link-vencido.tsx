import { LinkIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Sin token, o la API dice que el link venció o ya se usó.
export function LinkVencido() {
  return (
    <div className="flex flex-col gap-5">
      <div
        role="alert"
        className="flex gap-2.5 border-l-2 border-destructive bg-destructive/5 px-3 py-3 text-sm"
      >
        <LinkIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
        <p>
          <strong className="font-semibold">Este link ya no sirve.</strong>{" "}
          Vence a la hora y se usa una sola vez. Pedí uno nuevo y te lo
          mandamos a tu email.
        </p>
      </div>
      <Button asChild size="lg">
        <Link href="/recuperar">Pedir un link nuevo</Link>
      </Button>
    </div>
  );
}
