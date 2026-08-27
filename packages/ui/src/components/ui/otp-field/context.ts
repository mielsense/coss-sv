import { createContext } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import type { OTPValidationType } from "./otp-field-machine.js";

export interface OTPFieldContext {
  readonly activeIndex: number;
  readonly ariaDescribedBy: HTMLAttributes<HTMLDivElement>["aria-describedby"];
  readonly ariaInvalid: HTMLAttributes<HTMLDivElement>["aria-invalid"];
  readonly ariaLabel: HTMLAttributes<HTMLDivElement>["aria-label"];
  readonly ariaLabelledBy: HTMLAttributes<HTMLDivElement>["aria-labelledby"];
  readonly autocomplete: string | undefined;
  readonly disabled: boolean;
  readonly form: string | undefined;
  readonly inputMode: "decimal" | "email" | "none" | "numeric" | "search" | "tel" | "text" | "url";
  readonly length: number;
  readonly mask: boolean;
  readonly readonly: boolean;
  readonly required: boolean;
  readonly validationType: OTPValidationType;
  createSlot(): OTPFieldSlot;
  delete(slot: OTPFieldSlot, backward: boolean): void;
  focus(index: number): void;
  indexOf(slot: OTPFieldSlot): number;
  insert(raw: string, slot: OTPFieldSlot): void;
  register(slot: OTPFieldSlot, input: HTMLInputElement | null): void;
  unregister(slot: OTPFieldSlot): void;
  valueAt(slot: OTPFieldSlot): string;
}

export interface OTPFieldSlot {
  readonly key: symbol;
  element: HTMLInputElement | null;
}

export const [getOTPFieldContext, setOTPFieldContext] = createContext<OTPFieldContext>();
