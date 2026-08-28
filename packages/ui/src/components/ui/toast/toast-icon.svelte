<script lang="ts">
import {
  Alert02Icon,
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";

let { type }: { type: string } = $props();
const icon = $derived(
  type === "error"
    ? AlertCircleIcon
    : type === "info"
      ? InformationCircleIcon
      : type === "loading"
        ? Loading03Icon
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
