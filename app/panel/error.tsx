"use client";

import { ErrorCarga } from "@/components/error-carga";

export default function PanelError({ retry }: { retry: () => void }) {
  return <ErrorCarga retry={retry} />;
}
