import Link from "next/link";

type Miga = { href: string; texto: string };

// La última es la página actual y va sin link.
export function Migas({ migas }: { migas: Miga[] }) {
  return (
    <nav aria-label="Ubicación" className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-1.5 text-muted-foreground">
        {migas.map(({ href, texto }, i) => (
          <li key={href} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i < migas.length - 1 ? (
              <Link
                href={href}
                className="underline underline-offset-2 hover:text-foreground"
              >
                {texto}
              </Link>
            ) : (
              <span aria-current="page" className="text-foreground">
                {texto}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
