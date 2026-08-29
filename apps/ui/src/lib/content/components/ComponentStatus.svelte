<script lang="ts">
  type Props = {
    status: "experimental" | "ported" | "reviewed";
  };

  let { status }: Props = $props();
</script>

<span
  class="inline-flex min-h-6 items-center rounded-full border px-2 text-xs font-medium capitalize text-muted-foreground"
  data-status={status}
>
  {status}
</span>
