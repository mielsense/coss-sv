<script module lang="ts">
  import type { CheckboxProps } from "../checkbox/index.js";

  export type CheckboxGroupItemProps = CheckboxProps & {
    parent?: boolean;
  };
</script>

<script lang="ts">
  import Checkbox from "../checkbox/checkbox.svelte";
  import { getCheckboxGroupContext } from "./context.js";

  let {
    checked = $bindable(false),
    disabled = false,
    form,
    id,
    indeterminate: indeterminateProp = false,
    name,
    onCheckedChange,
    onclick,
    parent = false,
    ref = $bindable(null),
    required,
    value,
    ...props
  }: CheckboxGroupItemProps = $props();

  const group = getCheckboxGroupContext();
  const itemId = $derived(
    id ?? (typeof value === "string" && !parent ? group.itemInputId(value) : undefined),
  );
  const allChecked = $derived(
    group.allValues.length > 0 && group.allValues.every((item) => group.value.includes(item)),
  );
  const someChecked = $derived(group.allValues.some((item) => group.value.includes(item)));
  const parentIndeterminate = $derived(indeterminateProp || (someChecked && !allChecked));
  const controlledIds = $derived(group.allValues.map(group.itemInputId).join(" ") || undefined);
  const parentProps = $derived.by<CheckboxProps>(() => {
    const next: CheckboxProps = {
      ...props,
      checked: allChecked,
      "data-parent": "",
      disabled,
      indeterminate: parentIndeterminate,
      onCheckedChange: handleParentCheckedChange,
      onclick: handleClick,
    };

    if (controlledIds !== undefined) next["aria-controls"] = controlledIds;
    if (form !== undefined) next.form = form;
    if (id !== undefined) next.id = id;
    if (required !== undefined) next.required = required;

    return next;
  });
  const itemProps = $derived.by<CheckboxProps>(() => {
    const next: CheckboxProps = {
      ...props,
      disabled,
      indeterminate: indeterminateProp,
      onclick: handleClick,
    };

    if (form !== undefined) next.form = form;
    if (itemId !== undefined) next.id = itemId;
    if (name !== undefined) next.name = name;
    if (onCheckedChange !== undefined) next.onCheckedChange = onCheckedChange;
    if (required !== undefined) next.required = required;
    if (value !== undefined) next.value = value;

    return next;
  });

  function handleClick(event: Parameters<NonNullable<CheckboxProps["onclick"]>>[0]) {
    group.prepareChange(event);
    queueMicrotask(() => group.clearPreparedChange(event));
    onclick?.(event);
  }

  function handleParentCheckedChange(
    next: boolean,
    details: Parameters<NonNullable<CheckboxProps["onCheckedChange"]>>[1],
  ) {
    onCheckedChange?.(next, details);
    if (details.isCanceled) return;
    group.toggleParent();
  }

  $effect(() => {
    if (parent || typeof value !== "string") return;
    return group.registerItem(
      value,
      () => disabled || group.disabled || ref?.getAttribute("aria-disabled") === "true",
    );
  });
</script>

{#if parent}
  <Checkbox bind:ref {...parentProps} />
{:else}
  <Checkbox bind:checked bind:ref {...itemProps} />
{/if}
