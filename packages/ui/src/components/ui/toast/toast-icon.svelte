<script lang="ts">
  import Alert02Icon from "@hugeicons/core-free-icons/Alert02Icon";
  import AlertCircleIcon from "@hugeicons/core-free-icons/AlertCircleIcon";
  import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
  import InformationCircleIcon from "@hugeicons/core-free-icons/InformationCircleIcon";
  import Loading02Icon from "@hugeicons/core-free-icons/Loading02Icon";
  import HugeiconsIcon from "@/hugeicons-icon.svelte";

  let { type }: { type: string } = $props();
  const icon = $derived(
    type === "error"
      ? AlertCircleIcon
      : type === "info"
        ? InformationCircleIcon
        : type === "loading"
          ? Loading02Icon
          : type === "success"
            ? CheckmarkCircle02Icon
            : Alert02Icon,
  );
</script>

<HugeiconsIcon
  aria-hidden="true"
  class="in-data-[type=loading]:animate-spin in-data-[type=error]:text-destructive in-data-[type=info]:text-info in-data-[type=success]:text-success in-data-[type=warning]:text-warning in-data-[type=loading]:opacity-80"
  {icon}
  strokeWidth={2}
/>
