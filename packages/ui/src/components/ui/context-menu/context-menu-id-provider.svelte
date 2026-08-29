<script lang="ts">
  import type { Snippet } from "svelte";
  import { ContextMenuIdState, setContextMenuIdContext } from "./id-context.svelte.js";

  let {
    children,
    defaultPopupId,
    open,
    popupId = $bindable(),
  }: {
    children?: Snippet;
    defaultPopupId: string;
    open: () => boolean;
    popupId: string | undefined;
  } = $props();

  setContextMenuIdContext(
    new ContextMenuIdState(
      () => open(),
      () => popupId ?? defaultPopupId,
      (next) => {
        popupId = next;
      },
    ),
  );
</script>

{@render children?.()}
