import { z } from "zod";

// Mensajes para las reglas de los esquemas que no traen uno propio. Lo que no
// se cubre acá sale con los textos en español de zod.
z.config(z.locales.es());
z.config({
  customError: (issue) => {
    if (issue.code === "too_small" && issue.origin === "string") {
      return issue.input === "" || Number(issue.minimum) <= 1
        ? "Completá este campo"
        : `Tiene que tener al menos ${issue.minimum} caracteres`;
    }
    if (issue.code === "too_big" && issue.origin === "string") {
      return `Tiene que tener como máximo ${issue.maximum} caracteres`;
    }
    if (issue.code === "too_big" && issue.origin === "array") {
      return `Puede tener como máximo ${issue.maximum}`;
    }
  },
});
