<script module lang="ts">
  import type { HugeiconData, HugeiconsIconProps } from "@coss-sv/ui";
  import Add01Icon from "@hugeicons/core-free-icons/Add01Icon";
  import AlertCircleIcon from "@hugeicons/core-free-icons/AlertCircleIcon";
  import ArrowDown01Icon from "@hugeicons/core-free-icons/ArrowDown01Icon";
  import ArrowLeft02Icon from "@hugeicons/core-free-icons/ArrowLeft02Icon";
  import ArrowRight02Icon from "@hugeicons/core-free-icons/ArrowRight02Icon";
  import ArrowUp01Icon from "@hugeicons/core-free-icons/ArrowUp01Icon";
  import Bookmark02Icon from "@hugeicons/core-free-icons/Bookmark02Icon";
  import BookOpen01Icon from "@hugeicons/core-free-icons/BookOpen01Icon";
  import BoxIcon from "@hugeicons/core-free-icons/BoxIcon";
  import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
  import ChevronDownIcon from "@hugeicons/core-free-icons/ChevronDownIcon";
  import ChevronUpIcon from "@hugeicons/core-free-icons/ChevronUpIcon";
  import CopyIcon from "@hugeicons/core-free-icons/CopyIcon";
  import CornerUpLeftIcon from "@hugeicons/core-free-icons/CornerUpLeftIcon";
  import Delete02Icon from "@hugeicons/core-free-icons/Delete02Icon";
  import DollarSignIcon from "@hugeicons/core-free-icons/DollarSignIcon";
  import Download01Icon from "@hugeicons/core-free-icons/Download01Icon";
  import FloppyDiskIcon from "@hugeicons/core-free-icons/FloppyDiskIcon";
  import Folder01Icon from "@hugeicons/core-free-icons/Folder01Icon";
  import House01Icon from "@hugeicons/core-free-icons/House01Icon";
  import InboxIcon from "@hugeicons/core-free-icons/InboxIcon";
  import InformationCircleIcon from "@hugeicons/core-free-icons/InformationCircleIcon";
  import Link01Icon from "@hugeicons/core-free-icons/Link01Icon";
  import Mail01Icon from "@hugeicons/core-free-icons/Mail01Icon";
  import MinusSignIcon from "@hugeicons/core-free-icons/MinusSignIcon";
  import MoreHorizontalIcon from "@hugeicons/core-free-icons/MoreHorizontalIcon";
  import NextIcon from "@hugeicons/core-free-icons/NextIcon";
  import Notification01Icon from "@hugeicons/core-free-icons/Notification01Icon";
  import PanelsTopLeftIcon from "@hugeicons/core-free-icons/PanelsTopLeftIcon";
  import PauseIcon from "@hugeicons/core-free-icons/PauseIcon";
  import PencilIcon from "@hugeicons/core-free-icons/PencilIcon";
  import PercentIcon from "@hugeicons/core-free-icons/PercentIcon";
  import PlayIcon from "@hugeicons/core-free-icons/PlayIcon";
  import PreviousIcon from "@hugeicons/core-free-icons/PreviousIcon";
  import RotateCcwIcon from "@hugeicons/core-free-icons/RotateCcwIcon";
  import Route01Icon from "@hugeicons/core-free-icons/Route01Icon";
  import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";
  import SearchAddIcon from "@hugeicons/core-free-icons/SearchAddIcon";
  import SearchMinusIcon from "@hugeicons/core-free-icons/SearchMinusIcon";
  import Settings01Icon from "@hugeicons/core-free-icons/Settings01Icon";
  import Share03Icon from "@hugeicons/core-free-icons/Share03Icon";
  import Share08Icon from "@hugeicons/core-free-icons/Share08Icon";
  import StarIcon from "@hugeicons/core-free-icons/StarIcon";
  import TextAlignCenterIcon from "@hugeicons/core-free-icons/TextAlignCenterIcon";
  import TextAlignLeftIcon from "@hugeicons/core-free-icons/TextAlignLeftIcon";
  import TextAlignRightIcon from "@hugeicons/core-free-icons/TextAlignRightIcon";
  import TextBoldIcon from "@hugeicons/core-free-icons/TextBoldIcon";
  import TextItalicIcon from "@hugeicons/core-free-icons/TextItalicIcon";
  import TextUnderlineIcon from "@hugeicons/core-free-icons/TextUnderlineIcon";
  import Tick02Icon from "@hugeicons/core-free-icons/Tick02Icon";
  import UnfoldMoreIcon from "@hugeicons/core-free-icons/UnfoldMoreIcon";
  import UserIcon from "@hugeicons/core-free-icons/UserIcon";
  import ViewIcon from "@hugeicons/core-free-icons/ViewIcon";
  import ViewOffSlashIcon from "@hugeicons/core-free-icons/ViewOffSlashIcon";
  import VolumeHighIcon from "@hugeicons/core-free-icons/VolumeHighIcon";
  import VolumeMute02Icon from "@hugeicons/core-free-icons/VolumeMute02Icon";

  const icons = {
    "alert-circle": AlertCircleIcon,
    "align-center": TextAlignCenterIcon,
    "align-left": TextAlignLeftIcon,
    "align-right": TextAlignRightIcon,
    "arrow-down": ArrowDown01Icon,
    "arrow-left": ArrowLeft02Icon,
    "arrow-right": ArrowRight02Icon,
    "arrow-up": ArrowUp01Icon,
    bell: Notification01Icon,
    bookmark: Bookmark02Icon,
    bold: TextBoldIcon,
    book: BookOpen01Icon,
    cancel: Cancel01Icon,
    check: Tick02Icon,
    "chevron-down": ChevronDownIcon,
    "chevron-up": ChevronUpIcon,
    "corner-up-left": CornerUpLeftIcon,
    copy: CopyIcon,
    currency: DollarSignIcon,
    download: Download01Icon,
    eye: ViewIcon,
    "eye-off": ViewOffSlashIcon,
    folder: Folder01Icon,
    home: House01Icon,
    inbox: InboxIcon,
    "info-circle": InformationCircleIcon,
    italic: TextItalicIcon,
    link: Link01Icon,
    mail: Mail01Icon,
    minus: MinusSignIcon,
    more: MoreHorizontalIcon,
    next: NextIcon,
    package: BoxIcon,
    panels: PanelsTopLeftIcon,
    pause: PauseIcon,
    pencil: PencilIcon,
    percent: PercentIcon,
    play: PlayIcon,
    plus: Add01Icon,
    previous: PreviousIcon,
    "rotate-ccw": RotateCcwIcon,
    route: Route01Icon,
    save: FloppyDiskIcon,
    search: Search01Icon,
    share: Share03Icon,
    "share-2": Share08Icon,
    star: StarIcon,
    settings: Settings01Icon,
    trash: Delete02Icon,
    underline: TextUnderlineIcon,
    "unfold-more": UnfoldMoreIcon,
    user: UserIcon,
    "volume-high": VolumeHighIcon,
    "volume-mute": VolumeMute02Icon,
    "zoom-in": SearchAddIcon,
    "zoom-out": SearchMinusIcon,
  } as const;

  export type FixtureIconName = keyof typeof icons;
  type Props = Omit<HugeiconsIconProps, "children" | "icon" | "strokeWidth"> & {
    name: FixtureIconName;
  };
</script>

<script lang="ts">
  import { HugeiconsIcon } from "@coss-sv/ui";

  let { name, ...props }: Props = $props();
  const icon = $derived(icons[name] as HugeiconData);
</script>

<HugeiconsIcon {icon} strokeWidth={2} {...props} />
