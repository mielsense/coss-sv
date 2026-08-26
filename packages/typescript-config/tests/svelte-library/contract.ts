import type { ComponentProps } from "svelte";
import type Button from "./Button.svelte";

const validProps: ComponentProps<typeof Button> = {
  disabled: true,
  label: "Save",
};

// This proves that the .svelte declaration is resolved and its props remain typed.
// @ts-expect-error The required label prop is missing.
const invalidProps: ComponentProps<typeof Button> = { disabled: false };

export { invalidProps, validProps };
