<script lang="ts">
  import {
    Add01Icon,
    AlertCircleIcon,
    Calendar03Icon,
    Cancel01Icon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    InformationCircleIcon,
    MinusSignIcon,
    MoreHorizontalIcon,
    Search01Icon,
    TextFontIcon,
    UserRoundIcon,
  } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon, cn } from "@coss-sv/ui";

  const icons = {
    alert: AlertCircleIcon,
    calendar: Calendar03Icon,
    "chevron-down": ChevronDownIcon,
    "chevron-left": ChevronLeftIcon,
    "chevron-right": ChevronRightIcon,
    ellipsis: MoreHorizontalIcon,
    info: InformationCircleIcon,
    minus: MinusSignIcon,
    plus: Add01Icon,
    search: Search01Icon,
    "text-cursor": TextFontIcon,
    user: UserRoundIcon,
    x: Cancel01Icon,
  } as const;

  let {
    name,
    class: className = "",
  }: {
    name: keyof typeof icons;
    class?: string;
  } = $props();
</script>

<HugeiconsIcon
  aria-hidden="true"
  class={cn("size-4 text-muted-foreground/88", className)}
  icon={icons[name]}
  size={16}
  strokeWidth={2}
/>
