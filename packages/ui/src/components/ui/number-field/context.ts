import { createContext } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import type { NumberLocale } from "./number-field-machine.js";

export interface NumberFieldContext {
  readonly allowWheel: boolean;
  readonly ariaDescribedBy: HTMLAttributes<HTMLDivElement>["aria-describedby"];
  readonly ariaInvalid: HTMLAttributes<HTMLDivElement>["aria-invalid"];
  readonly ariaLabel: HTMLAttributes<HTMLDivElement>["aria-label"];
  readonly ariaLabelledBy: HTMLAttributes<HTMLDivElement>["aria-labelledby"];
  readonly canDecrement: boolean;
  readonly canIncrement: boolean;
  readonly disabled: boolean;
  readonly displayValue: string;
  readonly form: string | undefined;
  readonly id: string;
  readonly inputMode: "decimal" | "numeric";
  readonly locale: NumberLocale;
  readonly max: number | undefined;
  readonly min: number | undefined;
  readonly name: string | undefined;
  readonly readonly: boolean;
  readonly required: boolean;
  readonly size: "default" | "lg" | "sm";
  commit(): void;
  registerInput(input: HTMLInputElement | null): void;
  scrub(delta: number): void;
  setEditing(editing: boolean): void;
  setInput(raw: string): void;
  stepBy(multiplier: number): void;
}

export const [getNumberFieldContext, setNumberFieldContext] = createContext<NumberFieldContext>();
