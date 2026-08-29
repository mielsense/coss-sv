<script module lang="ts">
  import type { InputProps } from "../input/input.svelte";

  export type InputGroupInputProps = InputProps;
</script>

<script lang="ts">
  import type { Component } from "svelte";
  import InputComponent from "../input/input.svelte";

  const Input = InputComponent as Component<InputGroupInputProps, object, "ref" | "value">;

  let {
    class: className,
    ref = $bindable(null),
    value = $bindable(),
    ...props
  }: InputGroupInputProps = $props();
</script>

{#if className === undefined}
  <Input bind:ref bind:value unstyled {...props} />
{:else}
  <Input bind:ref bind:value unstyled class={className} {...props} />
{/if}
