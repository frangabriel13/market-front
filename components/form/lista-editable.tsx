"use client";

import { Plus, X } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  id: string;
  value: string[];
  onChange: (valor: string[]) => void;
  placeholder?: string;
  maxLength?: number;
  invalid?: boolean;
};

export function ListaEditable({
  id,
  value,
  onChange,
  placeholder,
  maxLength,
  invalid,
}: Props) {
  const [nuevo, setNuevo] = useState("");
  const [aviso, setAviso] = useState<string>();

  function agregar() {
    const item = nuevo.trim();
    if (!item) return;
    if (value.some((v) => v.toLowerCase() === item.toLowerCase())) {
      setAviso(`"${item}" ya está en la lista`);
      return;
    }
    onChange([...value, item]);
    setNuevo("");
    setAviso(undefined);
  }

  function alApretarTecla(evento: KeyboardEvent<HTMLInputElement>) {
    if (evento.key === "Enter") {
      evento.preventDefault();
      agregar();
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {value.map((item) => (
            <li
              key={item}
              className="flex h-8 items-center gap-1 border bg-secondary pr-1 pl-3 text-sm"
            >
              {item}
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => onChange(value.filter((v) => v !== item))}
                aria-label={`Quitar ${item}`}
              >
                <X />
              </Button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <Input
          id={id}
          value={nuevo}
          onChange={(e) => {
            setNuevo(e.target.value);
            setAviso(undefined);
          }}
          onKeyDown={alApretarTecla}
          placeholder={placeholder}
          maxLength={maxLength}
          aria-invalid={invalid}
        />
        <Button type="button" variant="outline" onClick={agregar}>
          <Plus />
          Agregar
        </Button>
      </div>
      {aviso && <p className="text-sm text-muted-foreground">{aviso}</p>}
    </div>
  );
}
