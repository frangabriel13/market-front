import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export function Volver({ href, texto }: { href: string; texto: string }) {
  return (
    <Link
      href={href}
      className="mb-4 -ml-1 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
    >
      <ChevronLeft className="size-4" />
      {texto}
    </Link>
  );
}
