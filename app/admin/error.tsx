"use client";

import { ErrorCarga } from "@/components/error-carga";

export default function AdminError({ retry }: { retry: () => void }) {
  return <ErrorCarga retry={retry} />;
}
