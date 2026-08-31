<script lang="ts">
  import Add01Icon from "@hugeicons/core-free-icons/Add01Icon";
  import AlertCircleIcon from "@hugeicons/core-free-icons/AlertCircleIcon";
  import Calendar03Icon from "@hugeicons/core-free-icons/Calendar03Icon";
  import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
  import ChevronDownIcon from "@hugeicons/core-free-icons/ChevronDownIcon";
  import ChevronLeftIcon from "@hugeicons/core-free-icons/ChevronLeftIcon";
  import ChevronRightIcon from "@hugeicons/core-free-icons/ChevronRightIcon";
  import InformationCircleIcon from "@hugeicons/core-free-icons/InformationCircleIcon";
  import MinusSignIcon from "@hugeicons/core-free-icons/MinusSignIcon";
  import MoreHorizontalIcon from "@hugeicons/core-free-icons/MoreHorizontalIcon";
  import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";
  import TextFontIcon from "@hugeicons/core-free-icons/TextFontIcon";
  import UserRoundIcon from "@hugeicons/core-free-icons/UserRoundIcon";
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
