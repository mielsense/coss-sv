import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { type HugeiconData, HugeiconsIcon } from "@coss-sv/ui";
import Add01Icon from "@hugeicons/core-free-icons/Add01Icon";
import AlertCircleIcon from "@hugeicons/core-free-icons/AlertCircleIcon";
import ArrowDown01Icon from "@hugeicons/core-free-icons/ArrowDown01Icon";
import ArrowLeft01Icon from "@hugeicons/core-free-icons/ArrowLeft01Icon";
import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon";
import ArrowTurnBackwardIcon from "@hugeicons/core-free-icons/ArrowTurnBackwardIcon";
import ArrowUp01Icon from "@hugeicons/core-free-icons/ArrowUp01Icon";
import BoldIcon from "@hugeicons/core-free-icons/BoldIcon";
import Bookmark01Icon from "@hugeicons/core-free-icons/Bookmark01Icon";
import BookOpen01Icon from "@hugeicons/core-free-icons/BookOpen01Icon";
import BoxIcon from "@hugeicons/core-free-icons/BoxIcon";
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
import ChevronDownIcon from "@hugeicons/core-free-icons/ChevronDownIcon";
import CircleIcon from "@hugeicons/core-free-icons/CircleIcon";
import Copy01Icon from "@hugeicons/core-free-icons/Copy01Icon";
import CopyIcon from "@hugeicons/core-free-icons/CopyIcon";
import Delete02Icon from "@hugeicons/core-free-icons/Delete02Icon";
import Download01Icon from "@hugeicons/core-free-icons/Download01Icon";
import Facebook01Icon from "@hugeicons/core-free-icons/Facebook01Icon";
import Folder01Icon from "@hugeicons/core-free-icons/Folder01Icon";
import Github01Icon from "@hugeicons/core-free-icons/Github01Icon";
import GoogleIcon from "@hugeicons/core-free-icons/GoogleIcon";
import House01Icon from "@hugeicons/core-free-icons/House01Icon";
import InboxIcon from "@hugeicons/core-free-icons/InboxIcon";
import ItalicIcon from "@hugeicons/core-free-icons/ItalicIcon";
import Link01Icon from "@hugeicons/core-free-icons/Link01Icon";
import Mail01Icon from "@hugeicons/core-free-icons/Mail01Icon";
import Menu01Icon from "@hugeicons/core-free-icons/Menu01Icon";
import MinusSignIcon from "@hugeicons/core-free-icons/MinusSignIcon";
import MoreHorizontalIcon from "@hugeicons/core-free-icons/MoreHorizontalIcon";
import NewTwitterIcon from "@hugeicons/core-free-icons/NewTwitterIcon";
import Notification01Icon from "@hugeicons/core-free-icons/Notification01Icon";
import PanelsTopLeftIcon from "@hugeicons/core-free-icons/PanelsTopLeftIcon";
import PencilIcon from "@hugeicons/core-free-icons/PencilIcon";
import PlusSignIcon from "@hugeicons/core-free-icons/PlusSignIcon";
import PrinterIcon from "@hugeicons/core-free-icons/PrinterIcon";
import QrCodeIcon from "@hugeicons/core-free-icons/QrCodeIcon";
import RotateLeft01Icon from "@hugeicons/core-free-icons/RotateLeft01Icon";
import Route01Icon from "@hugeicons/core-free-icons/Route01Icon";
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";
import Settings01Icon from "@hugeicons/core-free-icons/Settings01Icon";
import Share03Icon from "@hugeicons/core-free-icons/Share03Icon";
import Share08Icon from "@hugeicons/core-free-icons/Share08Icon";
import ShieldAlertIcon from "@hugeicons/core-free-icons/ShieldAlertIcon";
import StarIcon from "@hugeicons/core-free-icons/StarIcon";
import TextBoldIcon from "@hugeicons/core-free-icons/TextBoldIcon";
import TextItalicIcon from "@hugeicons/core-free-icons/TextItalicIcon";
import TextUnderlineIcon from "@hugeicons/core-free-icons/TextUnderlineIcon";
import ThumbsUpIcon from "@hugeicons/core-free-icons/ThumbsUpIcon";
import Tick01Icon from "@hugeicons/core-free-icons/Tick01Icon";
import TrashIcon from "@hugeicons/core-free-icons/TrashIcon";
import UnderlineIcon from "@hugeicons/core-free-icons/UnderlineIcon";
import UnfoldMoreIcon from "@hugeicons/core-free-icons/UnfoldMoreIcon";
import UserIcon from "@hugeicons/core-free-icons/UserIcon";
import UserRoundPlusIcon from "@hugeicons/core-free-icons/UserRoundPlusIcon";
import UsersRoundIcon from "@hugeicons/core-free-icons/UsersRoundIcon";
import VolumeHighIcon from "@hugeicons/core-free-icons/VolumeHighIcon";
import VolumeMute02Icon from "@hugeicons/core-free-icons/VolumeMute02Icon";
import type { Component } from "svelte";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";

const repositoryRoot = resolve(import.meta.dirname, "../../../..");

const clientRevealedIconParticles = new Set(["p-popover-2", "p-preview-card-1", "p-skeleton-1"]);

const ownedParticles = [
  "p-button-13",
  "p-button-14",
  "p-button-15",
  "p-button-16",
  "p-button-19",
  "p-button-20",
  "p-button-21",
  "p-button-22",
  "p-button-23",
  "p-button-24",
  "p-button-26",
  "p-button-27",
  "p-button-30",
  "p-button-31",
  "p-button-35",
  "p-button-36",
  "p-button-37",
  "p-button-38",
  "p-button-39",
  "p-button-40",
  "p-card-1",
  "p-card-3",
  "p-card-4",
  "p-card-6",
  "p-card-7",
  "p-card-8",
  "p-card-10",
  "p-card-11",
  "p-collapsible-1",
  "p-drawer-13",
  "p-empty-1",
  "p-frame-2",
  "p-popover-2",
  "p-popover-3",
  "p-popover-4",
  "p-preview-card-1",
  "p-skeleton-1",
  "p-slider-11",
  "p-slider-14",
  "p-slider-21",
  "p-switch-7",
  "p-switch-8",
  "p-switch-9",
  "p-tabs-6",
  "p-tabs-7",
  "p-tabs-8",
  "p-tabs-9",
  "p-tabs-11",
  "p-tabs-12",
  "p-tabs-13",
  "p-toggle-3",
  "p-toggle-7",
  "p-toggle-8",
  "p-toggle-group-1",
  "p-toggle-group-2",
  "p-toggle-group-3",
  "p-toggle-group-4",
  "p-toggle-group-5",
  "p-toggle-group-6",
  "p-toggle-group-7",
  "p-toggle-group-8",
  "p-toggle-group-9",
  "p-tooltip-2",
  "p-tooltip-3",
  "p-tooltip-4",
] as const;

const iconGeometryHashes = {
  Add01Icon: "a5a294ca98632c42d8b4ae02413c9fa429ad7cae03a4734e2e2f84b6a43c1a94",
  AlertCircleIcon: "639e9567528375c99d1b0ccc78766da856a74d92eac179b1b96b8708d01b91fa",
  ArrowDown01Icon: "0b8a8f5fe27dce2bf2f723623a596788e99f42c353524ad27b968b7b9ae9d241",
  ArrowLeft01Icon: "8fce721c8876130e4dd99b3cc36f401460efe3ec2d40eab79412a11031af9b38",
  ArrowRight01Icon: "29918b8ae4ba0ea73552b60f3185e355066cff860fae14e0acc5977c184e490e",
  ArrowTurnBackwardIcon: "b800e8fc5adfd5493c3b55d6a7c70fac1dd4b8143e2142b91f512b7560a2ff1b",
  ArrowUp01Icon: "9f0757fdc36e4778162b5bd91766c6cdf04073536c34db25ce7ce7484726bee3",
  BoldIcon: "d38612c0f450af94cd866ab3127f6424ff0c6f27e37701b73a87f8b61ab90718",
  BookOpen01Icon: "589379f9c480d26ceaa48225b15a570341e5cfbc3bf46c84af8137ca4de8dff8",
  Bookmark01Icon: "d35d3c10873f6435a6f672fc70d4ef83a388c8b97601d0470e11c77e929a816f",
  BoxIcon: "b8a3fbfeb0f51311e1145a76c9bed8ac039675be3bb63dcd711284ba456d394e",
  Cancel01Icon: "3c4cd2a198e4bcf21cac69e44ebd42347548868dd8035c06acbce3f126404a98",
  ChevronDownIcon: "0b8a8f5fe27dce2bf2f723623a596788e99f42c353524ad27b968b7b9ae9d241",
  CircleIcon: "96b7778208791f3e3bdc03a45063598c2993068692b9841fcd263a9bcb346ca6",
  Copy01Icon: "8af994a7cd766c9da2be49751aeb1c91e804d430247936fecdf77c4418d5c1a4",
  CopyIcon: "3923add82b96c0aca01968197fdc2fd57cb41db82a7854b13edcd504bd6d8b4e",
  Delete02Icon: "808c32f7dad84b3854bef6a434c0a15ba051626337865a9451f11a5be130ea16",
  Download01Icon: "9a9a6886716841729a7367eef314b3a53ebbfdca916da03b05d5520deba97a7f",
  Facebook01Icon: "efda2468856d2bcff871abf8ef9b630cf3c44f4a246dde08dba21c364e0f2143",
  Folder01Icon: "fe92f5a92ed1ba2a80ad9ff7028518fbd9cdd20f3491f34aa6f636347a8cbce4",
  Github01Icon: "f93ee0d864a3aed3bc7dc38460a054aea388516c817e85617419c79d5d072d4e",
  GoogleIcon: "5ca6bc46fd053a3c4f923c9426292f75652060168641c9d35d89f99551b9c554",
  House01Icon: "9836e1fb6ee75d3e5eb9ee8eca8014ed1a5eb3a04dd8f801e729a3c172a0e65c",
  InboxIcon: "d09f266cf960daecd01be51396880afd2d6dd096ec3e31087a1eb2048fbcca6a",
  ItalicIcon: "39befee8a42019d9544315d0a566c32ffcfd184a43de42f4d9715ec5c229d4ba",
  Link01Icon: "f2b62c22e1c7b797f49e91bbacf05687a379d3813a0003ddf03ef0734be5f092",
  Mail01Icon: "e9bed6c7b54382a55e09df16bb7cdf390777dfe056eb8f3b5dcc2f9729ca1a06",
  Menu01Icon: "01c68e4f925fd7f4239e413bd8ec3429d51ca533940e8670d60b98adc20fc66e",
  MinusSignIcon: "d4c7e10fb861806c43ddab094bdd1271490488e2c8accb5a87655048a319bc56",
  MoreHorizontalIcon: "64891f351442b6b1d764ecbd9d334f41e13546f28a0c6ccd734ac7ccba8f2419",
  NewTwitterIcon: "f13360d9db4976c4ef7798dbc63b6e6d66a7c68d0c2f287a385d2df09fc675b8",
  Notification01Icon: "9aeffa18660a220b4bbf3511c530b939d8718a6acf002fdd6e19ab608fc41abc",
  PanelsTopLeftIcon: "f4c9b0c3f608200eea4abba958ab76576c0d14a674c089dadb51eb805d013310",
  PencilIcon: "e447c7173b7f60e5d0b344e504bcf5c4080e52af590f75658c9ac79c19631c0b",
  PlusSignIcon: "9e86cf32040e65e2a907ff1e200fd0f0bdb1ccc049c6012ce7295d2a40fea5d4",
  PrinterIcon: "fe6a88eaa9b3efe3ae75dc678375083aa0d6fe6dabcf93f8ce1758b293321a10",
  QrCodeIcon: "9fb31982d5ae63453b9f7bb9cdbce89194f6d00e5c00684c18e8c783bbc6cad5",
  RotateLeft01Icon: "13d372b7f4eeef8de1ea4df9c23c6d0ce5c133eed4f1563fec3753c80f3ce1d7",
  Route01Icon: "d7cb0d74cc8c991aa7955787984b53f49383ead65b04679663be060ad3a44378",
  Search01Icon: "0b36e99e65cfcd9dc4ccb2f86d3d4c182402fd022522c040753c544939e4774b",
  Settings01Icon: "6b44c3049eafdbbd6588b07a97c3556bbf1fb5efcf99b49a5c2369b45c44d8b6",
  Share03Icon: "1f5a0d4fb4c41b86de394d7b5f563903023dffb966fb6534797e8f5572e7bcab",
  Share08Icon: "b07e61c7d90c1324f8d5bbdaf4153bcd555f0bc368770747b214595fcb5755b7",
  ShieldAlertIcon: "88db0ddd296eb24591f6474043334262ad334e9275601fbcac0cb0fded52a5f8",
  StarIcon: "82653014b062b899c5466740951f5216b8f460f515c703d3754e539639557669",
  TextBoldIcon: "e4d0ef08ecbe84827e17a039f37c784fdc30d02067f265827685302a50593ffa",
  TextItalicIcon: "e45aad9ab251575c15a0ddf017c707811ce81e30ff166116bca74ee20f7b1f39",
  TextUnderlineIcon: "45234e20977c60147d9907fcdd2a3f37d89bc5d2978aab3a29c49fd22cda10d8",
  ThumbsUpIcon: "823438c961069e352e889fbe4b58c0712194b7f41992b2057cdecdf30140938e",
  Tick01Icon: "135a2296cef6aed1ac543bc1b9f5612812cedd2bf12f3ce525e353c7cfb979f2",
  TrashIcon: "47c5b17136d855a806835c82e90155ee6b2b2acb2bd625896f5d2a69851c76ce",
  UnderlineIcon: "ecb7f08997f58eae7fc6daac94b8cf1d1423c1be3449c685a268613cffdf374c",
  UnfoldMoreIcon: "e9ff4ec167de6e402d3ff7819bd63825d8c67b70843753c4c195d8eaaf5221bd",
  UserIcon: "437e44259325bf8859467822e71d605616456d313314305e1399eb9712a0f357",
  UserRoundPlusIcon: "922d318fd9081be21d1d1755c478d9db9d026802e995fbada1b45593d5dafaa3",
  UsersRoundIcon: "83499bfe10829707a794e65b3c90c211ce406fc579cef7c84c1fa7d6cead1497",
  VolumeHighIcon: "e38c776ae587806da1c199f9e99fce3043fe491f683294785e781a0d035dfd1e",
  VolumeMute02Icon: "d087108a11138aea36b36d25f8c32583b4be638ffdf3231842d4346b8eb6eefe",
} as const;

type IconName = keyof typeof iconGeometryHashes;
type IconSite = { expression: string; icons: readonly IconName[] };
type ParticleIconContract = { bindings?: readonly IconName[]; sites: readonly IconSite[] };
type OwnedParticle = (typeof ownedParticles)[number];

const officialIcons = {
  Add01Icon,
  AlertCircleIcon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowTurnBackwardIcon,
  ArrowUp01Icon,
  BoldIcon,
  BookOpen01Icon,
  Bookmark01Icon,
  BoxIcon,
  Cancel01Icon,
  ChevronDownIcon,
  CircleIcon,
  Copy01Icon,
  CopyIcon,
  Delete02Icon,
  Download01Icon,
  Facebook01Icon,
  Folder01Icon,
  Github01Icon,
  GoogleIcon,
  House01Icon,
  InboxIcon,
  ItalicIcon,
  Link01Icon,
  Mail01Icon,
  Menu01Icon,
  MinusSignIcon,
  MoreHorizontalIcon,
  NewTwitterIcon,
  Notification01Icon,
  PanelsTopLeftIcon,
  PencilIcon,
  PlusSignIcon,
  PrinterIcon,
  QrCodeIcon,
  RotateLeft01Icon,
  Route01Icon,
  Search01Icon,
  Settings01Icon,
  Share03Icon,
  Share08Icon,
  ShieldAlertIcon,
  StarIcon,
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  ThumbsUpIcon,
  Tick01Icon,
  TrashIcon,
  UnderlineIcon,
  UnfoldMoreIcon,
  UserIcon,
  UserRoundPlusIcon,
  UsersRoundIcon,
  VolumeHighIcon,
  VolumeMute02Icon,
} satisfies Record<IconName, HugeiconData>;

const site = (expression: string, ...icons: IconName[]): IconSite => ({ expression, icons });

const textTools = ["TextBoldIcon", "TextItalicIcon", "TextUnderlineIcon"] as const;
const formattingTools = ["BoldIcon", "ItalicIcon", "UnderlineIcon"] as const;

const directSites = (...icons: IconName[]): IconSite[] => icons.map((icon) => site(icon, icon));
const textToolContract = {
  bindings: textTools,
  sites: [site("tool.icon", ...textTools)],
} as const;

const iconContract = {
  "p-button-13": { sites: directSites("Add01Icon") },
  "p-button-14": { sites: directSites("Add01Icon") },
  "p-button-15": { sites: directSites("Add01Icon") },
  "p-button-16": { sites: directSites("Download01Icon") },
  "p-button-19": {
    sites: [site("expanded ? ArrowUp01Icon : ArrowDown01Icon", "ArrowUp01Icon", "ArrowDown01Icon")],
  },
  "p-button-20": { sites: directSites("ArrowLeft01Icon") },
  "p-button-21": { sites: directSites("ArrowRight01Icon") },
  "p-button-22": {
    sites: directSites(
      "ArrowUp01Icon",
      "ArrowLeft01Icon",
      "CircleIcon",
      "ArrowRight01Icon",
      "ArrowDown01Icon",
    ),
  },
  "p-button-23": { sites: directSites("ThumbsUpIcon") },
  "p-button-24": {
    bindings: ["GoogleIcon", "Facebook01Icon", "NewTwitterIcon", "Github01Icon"],
    sites: [
      site("provider.icon", "GoogleIcon", "Facebook01Icon", "NewTwitterIcon", "Github01Icon"),
    ],
  },
  "p-button-26": { sites: directSites("StarIcon") },
  "p-button-27": { sites: directSites("QrCodeIcon") },
  "p-button-30": { sites: directSites("ArrowRight01Icon") },
  "p-button-31": { sites: directSites("PrinterIcon") },
  "p-button-35": {
    sites: [site("copied ? Tick01Icon : Copy01Icon", "Tick01Icon", "Copy01Icon")],
  },
  "p-button-36": {
    sites: [site("copied ? Tick01Icon : Copy01Icon", "Tick01Icon", "Copy01Icon")],
  },
  "p-button-37": { sites: directSites("Add01Icon") },
  "p-button-38": {
    bindings: ["GoogleIcon", "NewTwitterIcon", "Github01Icon"],
    sites: [site("provider.icon", "GoogleIcon", "NewTwitterIcon", "Github01Icon")],
  },
  "p-button-39": { sites: directSites("Menu01Icon", "Cancel01Icon") },
  "p-button-40": { sites: directSites("Cancel01Icon", "Download01Icon") },
  "p-card-1": { sites: directSites("AlertCircleIcon") },
  "p-card-3": { sites: directSites("ShieldAlertIcon") },
  "p-card-4": { sites: directSites("AlertCircleIcon") },
  "p-card-6": { sites: directSites("AlertCircleIcon") },
  "p-card-7": { sites: directSites("AlertCircleIcon") },
  "p-card-8": { sites: directSites("AlertCircleIcon") },
  "p-card-10": { sites: directSites("AlertCircleIcon") },
  "p-card-11": { sites: directSites("Add01Icon", "Folder01Icon") },
  "p-collapsible-1": { sites: directSites("ChevronDownIcon") },
  "p-drawer-13": {
    sites: directSites(
      "MoreHorizontalIcon",
      "PencilIcon",
      "CopyIcon",
      "Share03Icon",
      "Delete02Icon",
      "MoreHorizontalIcon",
      "PencilIcon",
      "CopyIcon",
      "Share03Icon",
      "Delete02Icon",
    ),
  },
  "p-empty-1": { sites: directSites("Route01Icon", "BookOpen01Icon") },
  "p-frame-2": { sites: directSites("ChevronDownIcon", "TrashIcon") },
  "p-popover-2": { sites: directSites("Cancel01Icon") },
  "p-popover-3": { sites: directSites("Notification01Icon", "UserIcon") },
  "p-popover-4": { sites: directSites("ChevronDownIcon") },
  "p-preview-card-1": { sites: directSites("StarIcon", "ArrowTurnBackwardIcon") },
  "p-skeleton-1": { sites: directSites("UsersRoundIcon", "UserRoundPlusIcon") },
  "p-slider-11": { sites: directSites("VolumeMute02Icon", "VolumeHighIcon") },
  "p-slider-14": { sites: directSites("MinusSignIcon", "PlusSignIcon") },
  "p-slider-21": { sites: directSites("RotateLeft01Icon") },
  "p-switch-7": {
    sites: directSites("Search01Icon", "UnfoldMoreIcon", "Cancel01Icon", "Add01Icon", "Copy01Icon"),
  },
  "p-switch-8": {
    sites: directSites(
      "Search01Icon",
      "ArrowRight01Icon",
      "Cancel01Icon",
      "Add01Icon",
      "Copy01Icon",
    ),
  },
  "p-switch-9": {
    sites: directSites("Search01Icon", "Cancel01Icon", "Add01Icon", "Copy01Icon"),
  },
  "p-tabs-6": { sites: directSites("House01Icon", "PanelsTopLeftIcon", "Settings01Icon") },
  "p-tabs-7": { sites: directSites("House01Icon", "PanelsTopLeftIcon", "Settings01Icon") },
  "p-tabs-8": { sites: directSites("House01Icon", "PanelsTopLeftIcon", "Settings01Icon") },
  "p-tabs-9": { sites: directSites("House01Icon", "PanelsTopLeftIcon", "BoxIcon") },
  "p-tabs-11": { sites: directSites("House01Icon", "PanelsTopLeftIcon", "Settings01Icon") },
  "p-tabs-12": { sites: directSites("House01Icon", "InboxIcon", "Settings01Icon") },
  "p-tabs-13": { sites: directSites("House01Icon", "PanelsTopLeftIcon", "Settings01Icon") },
  "p-toggle-3": { sites: directSites("TextBoldIcon") },
  "p-toggle-7": textToolContract,
  "p-toggle-8": { sites: directSites("Bookmark01Icon") },
  "p-toggle-group-1": textToolContract,
  "p-toggle-group-2": textToolContract,
  "p-toggle-group-3": textToolContract,
  "p-toggle-group-4": textToolContract,
  "p-toggle-group-5": textToolContract,
  "p-toggle-group-6": textToolContract,
  "p-toggle-group-7": textToolContract,
  "p-toggle-group-8": textToolContract,
  "p-toggle-group-9": textToolContract,
  "p-tooltip-2": {
    bindings: formattingTools,
    sites: [site("control.icon", ...formattingTools)],
  },
  "p-tooltip-3": {
    bindings: formattingTools,
    sites: [site("control.icon", ...formattingTools)],
  },
  "p-tooltip-4": {
    bindings: ["Link01Icon", "Mail01Icon", "Share08Icon"],
    sites: [site("control.icon", "Link01Icon", "Mail01Icon", "Share08Icon")],
  },
} satisfies Record<OwnedParticle, ParticleIconContract>;

const particleLoaders = import.meta.glob<{ default: Component }>([
  "../../registry/default/particles/p-button-{13,14,15,16,19,20,21,22,23,24,26,27,30,31,35,36,37,38,39,40}.svelte",
  "../../registry/default/particles/p-card-{1,3,4,6,7,8,10,11}.svelte",
  "../../registry/default/particles/p-collapsible-1.svelte",
  "../../registry/default/particles/p-drawer-13.svelte",
  "../../registry/default/particles/p-empty-1.svelte",
  "../../registry/default/particles/p-frame-2.svelte",
  "../../registry/default/particles/p-popover-{2,3,4}.svelte",
  "../../registry/default/particles/p-preview-card-1.svelte",
  "../../registry/default/particles/p-skeleton-1.svelte",
  "../../registry/default/particles/p-slider-{11,14,21}.svelte",
  "../../registry/default/particles/p-switch-{7,8,9}.svelte",
  "../../registry/default/particles/p-tabs-{6,7,8,9,11,12,13}.svelte",
  "../../registry/default/particles/p-toggle-{3,7,8}.svelte",
  "../../registry/default/particles/p-toggle-group-{1,2,3,4,5,6,7,8,9}.svelte",
  "../../registry/default/particles/p-tooltip-{2,3,4}.svelte",
]);

function particleSource(id: OwnedParticle): string {
  return readFileSync(
    resolve(repositoryRoot, `apps/ui/registry/default/particles/${id}.svelte`),
    "utf8",
  );
}

function normalizeExpression(expression: string): string {
  return expression.replace(/\s+/g, " ").trim();
}

function sourceIconSites(source: string): string[] {
  return [...source.matchAll(/<HugeiconsIcon\b[\s\S]*?\/>/g)].map((match) => {
    const expression = match[0].match(/\bicon=\{([^}]+)\}/)?.[1];
    expect(expression, match[0]).toBeDefined();
    expect(match[0]).toContain("strokeWidth={2}");
    return normalizeExpression(expression ?? "");
  });
}

function sourceIconBindings(source: string): string[] {
  return [...source.matchAll(/\bicon:\s*([A-Za-z0-9]+Icon)\b/g)].map((match) => match[1] ?? "");
}

function sourceCoreIconImports(source: string): string[] {
  const imports = [
    ...source.matchAll(
      /import\s+([A-Za-z0-9]+Icon)\s+from\s+["']@hugeicons\/core-free-icons\/([A-Za-z0-9]+Icon)["'];/g,
    ),
  ];
  expect(imports.length).toBeGreaterThan(0);
  return imports.map((match) => match[1] ?? "").sort();
}

function officialIcon(name: IconName): HugeiconData {
  const icon: unknown = officialIcons[name];
  expect(Array.isArray(icon), name).toBe(true);
  return icon as HugeiconData;
}

describe("owned registry particle Hugeicons renderer migration", () => {
  test("locks the exact 65-particle ownership and icon contract", () => {
    expect(ownedParticles).toHaveLength(65);
    expect(Object.values(iconContract).flatMap(({ sites }) => sites)).toHaveLength(113);
    expect(Object.keys(iconContract).sort()).toEqual([...ownedParticles].sort());
    expect(Object.keys(particleLoaders).sort()).toEqual(
      ownedParticles.map((id) => `../../registry/default/particles/${id}.svelte`).sort(),
    );
  });

  test.each(Object.entries(iconGeometryHashes) as [IconName, string][])(
    "locks official %s geometry and central-renderer output",
    (name, expectedHash) => {
      const icon = officialIcon(name);
      const geometryHash = createHash("sha256").update(JSON.stringify(icon)).digest("hex");
      expect(geometryHash).toBe(expectedHash);

      const body = render(HugeiconsIcon, { props: { icon, strokeWidth: 2 } }).body;
      expect(body).toContain("<svg");
      expect(body).toContain('stroke-width="2"');
      expect(body.match(/<(?:path|circle|ellipse|rect)\b/g)).toHaveLength(icon.length);
    },
  );

  test.each(ownedParticles)("locks every %s icon render site and binding", (id) => {
    const source = particleSource(id);
    const contract = iconContract[id];
    const expectedIcons = [...new Set(contract.sites.flatMap(({ icons }) => icons))].sort();

    expect(source).not.toContain("@hugeicons/svelte");
    expect(source).toMatch(
      /import\s*\{[^}]*\bHugeiconsIcon\b[^}]*\}\s*from\s*["']@coss-sv\/ui["'];/,
    );
    expect(sourceIconSites(source)).toEqual(
      contract.sites.map(({ expression }) => normalizeExpression(expression)),
    );
    expect(sourceIconBindings(source)).toEqual("bindings" in contract ? contract.bindings : []);
    expect(sourceCoreIconImports(source)).toEqual(expectedIcons);
  });

  test.each(ownedParticles)("server-renders %s through the central icon renderer", async (id) => {
    const load = particleLoaders[`../../registry/default/particles/${id}.svelte`];
    expect(load).toBeDefined();
    const module = await load?.();
    const body = render(module?.default as Component).body;
    if (clientRevealedIconParticles.has(id)) {
      expect(body).not.toContain("<svg");
      return;
    }
    expect(body).toContain("<svg");
    expect(body).toContain('stroke-width="2"');
    expect(body).toMatch(/<(?:path|circle|ellipse|rect)\b/);
  });
});
