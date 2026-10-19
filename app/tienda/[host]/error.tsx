"use client";

import { ErrorCarga } from "@/components/error-carga";

export default function TiendaError({ retry }: { retry: () => void }) {
  return <ErrorCarga retry={retry} />;
}
