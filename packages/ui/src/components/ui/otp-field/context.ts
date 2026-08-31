import { createContext } from "svelte";
import type { HTMLAttributes, HTMLInputAttributes } from "svelte/elements";
import type { OTPValidationType } from "./otp-field-machine.js";

export interface OTPFieldContext {
  readonly activeIndex: number;
  readonly ariaInvalid: HTMLAttributes<HTMLDivElement>["aria-invalid"];
  readonly autocomplete: HTMLInputAttributes["autocomplete"];
  readonly disabled: boolean;
  readonly id: string;
  readonly inputMode: "decimal" | "email" | "none" | "numeric" | "search" | "tel" | "text" | "url";
  readonly length: number;
  readonly mask: boolean;
  readonly readonly: boolean;
  readonly validationType: OTPValidationType;
  clear(event: KeyboardEvent): void;
  createSlot(): OTPFieldSlot;
  delete(slot: OTPFieldSlot, backward: boolean, event: KeyboardEvent): void;
  focus(index: number): void;
  indexOf(slot: OTPFieldSlot): number;
  input(raw: string, slot: OTPFieldSlot, event: InputEvent | Event): void;
  paste(raw: string, slot: OTPFieldSlot, event: ClipboardEvent): void;
  register(slot: OTPFieldSlot, input: HTMLInputElement | null): void;
  unregister(slot: OTPFieldSlot): void;
  valueAt(slot: OTPFieldSlot): string;
}

export interface OTPFieldSlot {
  readonly key: symbol;
  element: HTMLInputElement | null;
}

export const [getOTPFieldContext, setOTPFieldContext] = createContext<OTPFieldContext>();
