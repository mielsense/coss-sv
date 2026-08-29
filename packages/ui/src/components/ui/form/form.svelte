<script module lang="ts">
  import { Form as FormPrimitive } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";

  export type FormProps = ComponentProps<typeof FormPrimitive>;
</script>

<script lang="ts">
  let { class: className, ref = $bindable(null), ...props }: FormProps = $props();

  let primitive: { validate: (fieldName?: string) => void } | undefined;

  export function validate(fieldName?: string): void {
    primitive?.validate(fieldName);
  }
</script>

<FormPrimitive bind:this={primitive} bind:ref data-slot="form" class={className} {...props} />
