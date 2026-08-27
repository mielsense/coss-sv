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
  readonly inputMode: "decimal" | "email" | "none" | "numeric" | "search" | "tel" | "text" | "url";
  readonly length: number;
  readonly mask: boolean;
  readonly readonly: boolean;
  readonly required: boolean;
  readonly validationType: OTPValidationType;
  claimIndex(): number;
  delete(index: number, backward: boolean): void;
  focus(index: number): void;
  insert(raw: string, index: number): void;
  register(index: number, input: HTMLInputElement | null): void;
  valueAt(index: number): string;
}

export const [getOTPFieldContext, setOTPFieldContext] = createContext<OTPFieldContext>();
