import { Skeleton } from "@/components/ui/skeleton";

export function FormularioCargando() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}
