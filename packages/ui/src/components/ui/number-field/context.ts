import { createContext } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import type { NumberLocale } from "./number-field-machine.js";

export interface NumberFieldContext {
  readonly allowWheel: boolean;
  readonly ariaDescribedBy: HTMLAttributes<HTMLDivElement>["aria-describedby"];
  readonly ariaInvalid: HTMLAttributes<HTMLDivElement>["aria-invalid"];
  readonly ariaLabel: HTMLAttributes<HTMLDivElement>["aria-label"];
  readonly ariaLabelledBy: HTMLAttributes<HTMLDivElement>["aria-labelledby"];
  readonly ariaValue: number | null;
  readonly canDecrement: boolean;
  readonly canIncrement: boolean;
  readonly disabled: boolean;
  readonly displayValue: string;
  readonly defaultAccessibleName: string | undefined;
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
  readonly scrubLabelId: string | undefined;
  commit(event: Event, reason?: "input-blur" | "keyboard" | "scrub"): void;
  commitStep(event: Event, reason: "decrement-press" | "increment-press"): void;
  focusInput(): void;
  registerInput(input: HTMLInputElement | null): void;
  registerScrubLabelId(id: string): () => void;
  scrub(delta: number, event: PointerEvent): void;
  setBoundary(value: number, event: KeyboardEvent): void;
  setEditing(editing: boolean): void;
  setInput(raw: string, event: InputEvent | Event): void;
  stepBy(
    multiplier: number,
    event: KeyboardEvent | MouseEvent | WheelEvent,
    reason: "decrement-press" | "increment-press" | "keyboard" | "wheel",
    commit?: boolean,
  ): boolean;
}

export const [getNumberFieldContext, setNumberFieldContext] = createContext<NumberFieldContext>();
