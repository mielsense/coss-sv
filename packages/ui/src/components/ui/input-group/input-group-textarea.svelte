<script module lang="ts">
  import type { TextareaProps } from "../textarea/textarea.svelte";

  export type InputGroupTextareaProps = TextareaProps;
</script>

<script lang="ts">
  import type { Component } from "svelte";
  import TextareaComponent from "../textarea/textarea.svelte";

  const Textarea = TextareaComponent as Component<InputGroupTextareaProps, object, "ref" | "value">;

  let {
    class: className,
    ref = $bindable(null),
    value = $bindable(),
    ...props
  }: InputGroupTextareaProps = $props();
</script>

{#if className === undefined}
  <Textarea bind:ref bind:value unstyled {...props} />
{:else}
  <Textarea bind:ref bind:value unstyled class={className} {...props} />
{/if}
