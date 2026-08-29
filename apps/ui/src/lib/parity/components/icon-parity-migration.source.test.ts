import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { HugeiconsIcon } from "@coss-sv/ui";
import {
  Add01Icon,
  AlertCircleIcon,
  ArrowDown01Icon,
  ArrowDown02Icon,
  ArrowLeft02Icon,
  ArrowRight02Icon,
  ArrowTurnBackwardIcon,
  ArrowUp01Icon,
  ArrowUp02Icon,
  Bookmark02Icon,
  BookOpen01Icon,
  BoxIcon,
  CableIcon,
  Cancel01Icon,
  ChevronDownIcon,
  CircleQuestionMarkIcon,
  CodeXmlIcon,
  CopyIcon,
  CornerDownLeftIcon,
  Delete02Icon,
  DollarSignIcon,
  Download01Icon,
  FloppyDiskIcon,
  Folder01Icon,
  GlobeIcon,
  House01Icon,
  InboxIcon,
  InformationCircleIcon,
  LayersIcon,
  Link01Icon,
  Location01Icon,
  Mail01Icon,
  MinusSignIcon,
  MoreHorizontalIcon,
  NextIcon,
  Notification01Icon,
  PanelsTopLeftIcon,
  PauseIcon,
  PencilIcon,
  PercentIcon,
  PlayIcon,
  PlusSignIcon,
  PreviousIcon,
  ReloadIcon,
  Route01Icon,
  Search01Icon,
  SearchAddIcon,
  SearchMinusIcon,
  Settings01Icon,
  Share03Icon,
  Share08Icon,
  SidebarLeftIcon,
  SparklesIcon,
  StarIcon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  Tick02Icon,
  UnfoldMoreIcon,
  UserIcon,
  ViewIcon,
  ViewOffSlashIcon,
  VolumeHighIcon,
  VolumeMute02Icon,
  ZapIcon,
} from "@hugeicons/core-free-icons";
import { parse } from "svelte/compiler";
import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import SidebarIconSsrFixture from "../../../../tests/fixtures/sidebar-icon-ssr-fixture.svelte";
import FixtureIcon, { type FixtureIconName } from "./fixture-icon.svelte";

type IconData = readonly (readonly [string, Readonly<Record<string, string | number>>])[];
type AstNode = {
  attributes?: AstNode[];
  end?: number;
  expression?: AstNode;
  imported?: { name?: string };
  local?: { name?: string };
  name?: string;
  source?: { value?: string };
  specifiers?: AstNode[];
  start?: number;
  type?: string;
  [key: string]: unknown;
};

const fixtureRoot = import.meta.dirname;
const packageRoot = resolve(fixtureRoot, "../../../../../../packages/ui/src");
const fixtureModules = import.meta.glob("./*.svelte");

const migratedFixtures = [
  "alert.svelte",
  "autocomplete.svelte",
  "badge.svelte",
  "button.svelte",
  "card.svelte",
  "collapsible.svelte",
  "combobox.svelte",
  "command.svelte",
  "context-menu.svelte",
  "drawer.svelte",
  "empty.svelte",
  "field.svelte",
  "group.svelte",
  "input-group.svelte",
  "menu.svelte",
  "number-field.svelte",
  "popover.svelte",
  "preview-card.svelte",
  "select.svelte",
  "slider.svelte",
  "tabs.svelte",
  "toast.svelte",
  "toggle-group.svelte",
  "toggle.svelte",
  "toolbar.svelte",
  "tooltip.svelte",
] as const;

const semanticIconData = {
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
  "plus-sign": PlusSignIcon,
  previous: PreviousIcon,
  redo: ArrowTurnBackwardIcon,
  reset: ReloadIcon,
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
} satisfies Record<FixtureIconName, IconData>;

const officialIconData = {
  ...semanticIconData,
  ArrowDown02Icon,
  ArrowLeft02Icon,
  ArrowUp02Icon,
  CableIcon,
  Cancel01Icon,
  CircleQuestionMarkIcon,
  CodeXmlIcon,
  CornerDownLeftIcon,
  GlobeIcon,
  LayersIcon,
  Location01Icon,
  Search01Icon,
  SparklesIcon,
  UnfoldMoreIcon,
  ZapIcon,
} satisfies Record<string, IconData>;

type OfficialIconName = keyof typeof officialIconData;
type SiteContract = { count: number; icons: readonly OfficialIconName[]; key: string };

function site(key: string, count: number, ...icons: OfficialIconName[]): SiteContract {
  return { count, icons, key };
}

const fixtureIconContracts = {
  "alert.svelte": [site('component:FixtureIcon:name="info-circle"', 1, "info-circle")],
  "autocomplete.svelte": [
    site("component:HugeiconsIcon:icon={Search01Icon}:strokeWidth={2}", 1, "Search01Icon"),
    site("component:HugeiconsIcon:icon={Location01Icon}:strokeWidth={2}", 1, "Location01Icon"),
  ],
  "badge.svelte": [site('component:FixtureIcon:name="check"', 1, "check")],
  "button.svelte": [
    site('component:FixtureIcon:name="plus"', 3, "plus"),
    site('component:FixtureIcon:name="download"', 1, "download"),
  ],
  "card.svelte": [
    site('component:FixtureIcon:name="unfold-more"', 1, "unfold-more"),
    site('component:FixtureIcon:name="arrow-up"', 1, "arrow-up"),
    site('component:FixtureIcon:name="check"', 1, "check"),
    site('component:FixtureIcon:name="arrow-down"', 1, "arrow-down"),
    site('component:FixtureIcon:name="alert-circle"', 1, "alert-circle"),
    site('component:FixtureIcon:name="plus"', 1, "plus"),
    site('component:FixtureIcon:name="folder"', 1, "folder"),
  ],
  "collapsible.svelte": [
    site('component:FixtureIcon:name="chevron-down"', 2, "chevron-down"),
    site('component:FixtureIcon:name="trash"', 1, "trash"),
  ],
  "combobox.svelte": [
    site("component:HugeiconsIcon:icon={Search01Icon}:strokeWidth={2}", 1, "Search01Icon"),
    site("component:HugeiconsIcon:icon={Cancel01Icon}:strokeWidth={2}", 1, "Cancel01Icon"),
    site("component:HugeiconsIcon:icon={UnfoldMoreIcon}:strokeWidth={2}", 3, "UnfoldMoreIcon"),
  ],
  "command.svelte": [
    site("component:HugeiconsIcon:icon={ArrowUp02Icon}:strokeWidth={2}", 1, "ArrowUp02Icon"),
    site("component:HugeiconsIcon:icon={ArrowDown02Icon}:strokeWidth={2}", 1, "ArrowDown02Icon"),
    site(
      "component:HugeiconsIcon:icon={CornerDownLeftIcon}:strokeWidth={2}",
      2,
      "CornerDownLeftIcon",
    ),
    site("component:HugeiconsIcon:icon={SparklesIcon}:strokeWidth={2}", 2, "SparklesIcon"),
    site("component:HugeiconsIcon:icon={Search01Icon}:strokeWidth={2}", 1, "Search01Icon"),
    site("component:HugeiconsIcon:icon={ArrowLeft02Icon}:strokeWidth={2}", 1, "ArrowLeft02Icon"),
    site(
      "component:HugeiconsIcon:icon={CircleQuestionMarkIcon}:strokeWidth={2}",
      1,
      "CircleQuestionMarkIcon",
    ),
  ],
  "context-menu.svelte": [
    site('component:FixtureIcon:name="pencil"', 1, "pencil"),
    site('component:FixtureIcon:name="copy"', 1, "copy"),
    site('component:FixtureIcon:name="share"', 1, "share"),
    site('component:FixtureIcon:name="trash"', 1, "trash"),
    site("render:pencilIcon()", 1, "pencil"),
    site("render:copyIcon()", 1, "copy"),
    site("render:shareIcon()", 1, "share"),
    site("render:trashIcon()", 1, "trash"),
  ],
  "drawer.svelte": [
    site('component:FixtureIcon:name="more"', 2, "more"),
    site('component:FixtureIcon:name="pencil"', 2, "pencil"),
    site('component:FixtureIcon:name="copy"', 2, "copy"),
    site('component:FixtureIcon:name="share"', 2, "share"),
    site('component:FixtureIcon:name="trash"', 2, "trash"),
  ],
  "empty.svelte": [
    site('component:FixtureIcon:name="route"', 1, "route"),
    site('component:FixtureIcon:name="book"', 1, "book"),
  ],
  "field.svelte": [
    site("render:arrowRightIcon()", 1, "arrow-right"),
    site('component:FixtureIcon:name="arrow-right"', 1, "arrow-right"),
  ],
  "group.svelte": [
    site('render:icon("zoom-in")', 1, "zoom-in"),
    site('render:icon("zoom-out")', 1, "zoom-out"),
    site('render:icon("arrow-left", true)', 1, "arrow-left"),
    site('render:icon("arrow-right", true)', 1, "arrow-right"),
    site('render:icon("plus", true)', 1, "plus"),
    site(
      "component:FixtureIcon:name={name as FixtureIconName}",
      1,
      "zoom-in",
      "zoom-out",
      "arrow-left",
      "arrow-right",
      "plus",
    ),
  ],
  "input-group.svelte": [
    site('render:icon("search", true)', 4, "search"),
    site('render:icon("mail", true)', 1, "mail"),
    site('render:icon("arrow-right", true)', 1, "arrow-right"),
    site('render:icon("bold", true)', 1, "bold"),
    site('render:icon("italic", true)', 1, "italic"),
    site('render:icon("link", true)', 1, "link"),
    site('render:icon("x", true)', 1, "cancel"),
    site('render:icon(isPasswordVisible ? "eye-off" : "eye", true)', 1, "eye-off", "eye"),
    site(
      'render:icon( requirement.met ? "check" : "x", true, requirement.met ? "size-4 text-emerald-500" : "size-4 text-muted-foreground/80", )',
      1,
      "check",
      "cancel",
    ),
    site(
      'component:FixtureIcon:name={name === "x" ? "cancel" : name}',
      1,
      "search",
      "mail",
      "arrow-right",
      "bold",
      "italic",
      "link",
      "cancel",
      "eye",
      "eye-off",
      "check",
    ),
  ],
  "menu.svelte": [
    site('component:FixtureIcon:name="play"', 1, "play"),
    site('component:FixtureIcon:name="pause"', 1, "pause"),
    site('component:FixtureIcon:name="previous"', 1, "previous"),
    site('component:FixtureIcon:name="next"', 1, "next"),
    site('component:FixtureIcon:name="trash"', 1, "trash"),
    site("render:playIcon()", 1, "play"),
    site("render:pauseIcon()", 1, "pause"),
    site("render:skipBackIcon()", 1, "previous"),
    site("render:skipForwardIcon()", 1, "next"),
    site("render:trashIcon()", 1, "trash"),
  ],
  "number-field.svelte": [
    site('component:FixtureIcon:name="unfold-more"', 1, "unfold-more"),
    site('component:FixtureIcon:name="arrow-up"', 1, "arrow-up"),
    site('component:FixtureIcon:name="check"', 1, "check"),
    site('component:FixtureIcon:name="arrow-down"', 1, "arrow-down"),
    site('component:FixtureIcon:name="arrow-right"', 1, "arrow-right"),
    site('component:FixtureIcon:name="reset"', 1, "reset"),
  ],
  "popover.svelte": [
    site("render:xIcon()", 1, "cancel"),
    site("render:bellIcon()", 1, "bell"),
    site("render:userIcon()", 1, "user"),
    site("render:chevronDownIcon()", 1, "arrow-down"),
    site('component:FixtureIcon:name="cancel"', 1, "cancel"),
    site('component:FixtureIcon:name="bell"', 1, "bell"),
    site('component:FixtureIcon:name="user"', 1, "user"),
    site('component:FixtureIcon:name="arrow-down"', 1, "arrow-down"),
  ],
  "preview-card.svelte": [
    site("render:starIcon()", 1, "star"),
    site("render:cornerUpLeftIcon()", 1, "redo"),
    site('component:FixtureIcon:name="star"', 1, "star"),
    site('component:FixtureIcon:name="redo"', 1, "redo"),
  ],
  "select.svelte": [
    site("component:HugeiconsIcon:icon={CableIcon}:strokeWidth={2}", 1, "CableIcon"),
    site(
      "component:HugeiconsIcon:icon={item.icon}:strokeWidth={2}",
      2,
      "LayersIcon",
      "ZapIcon",
      "GlobeIcon",
      "CodeXmlIcon",
    ),
  ],
  "slider.svelte": [
    site('component:FixtureIcon:name="volume-mute"', 1, "volume-mute"),
    site('component:FixtureIcon:name="volume-high"', 1, "volume-high"),
    site('component:FixtureIcon:name="minus"', 1, "minus"),
    site('component:FixtureIcon:name="plus-sign"', 1, "plus-sign"),
  ],
  "tabs.svelte": [
    site("render:houseIcon()", 5, "home"),
    site("render:panelsIcon()", 4, "panels"),
    site("render:settingsIcon()", 5, "settings"),
    site('render:houseIcon("opacity-60", 16)', 1, "home"),
    site('render:panelsIcon("opacity-60", 16)', 1, "panels"),
    site('render:boxIcon("opacity-60", 16)', 1, "package"),
    site("render:inboxIcon()", 1, "inbox"),
    site('component:FixtureIcon:name="home"', 1, "home"),
    site('component:FixtureIcon:name="panels"', 1, "panels"),
    site('component:FixtureIcon:name="settings"', 1, "settings"),
    site('component:FixtureIcon:name="package"', 1, "package"),
    site('component:FixtureIcon:name="inbox"', 1, "inbox"),
  ],
  "toast.svelte": [
    site('render:checkIcon("size-4")', 1, "check"),
    site('render:copyIcon("size-4")', 1, "copy"),
    site("render:downloadIcon()", 1, "download"),
    site("render:saveIcon()", 2, "save"),
    site('component:FixtureIcon:name="check"', 1, "check"),
    site('component:FixtureIcon:name="copy"', 1, "copy"),
    site('component:FixtureIcon:name="download"', 1, "download"),
    site('component:FixtureIcon:name="save"', 1, "save"),
  ],
  "toggle-group.svelte": [
    site("render:boldIcon()", 8, "bold"),
    site("render:italicIcon()", 8, "italic"),
    site("render:underlineIcon()", 8, "underline"),
    site('component:FixtureIcon:name="bold"', 1, "bold"),
    site('component:FixtureIcon:name="italic"', 1, "italic"),
    site('component:FixtureIcon:name="underline"', 1, "underline"),
  ],
  "toggle.svelte": [
    site("render:boldIcon()", 2, "bold"),
    site("render:italicIcon()", 1, "italic"),
    site("render:underlineIcon()", 1, "underline"),
    site("render:bookmarkIcon()", 1, "bookmark"),
    site('component:FixtureIcon:name="bold"', 1, "bold"),
    site('component:FixtureIcon:name="italic"', 1, "italic"),
    site('component:FixtureIcon:name="underline"', 1, "underline"),
    site('component:FixtureIcon:name="bookmark"', 1, "bookmark"),
  ],
  "toolbar.svelte": [
    site(
      "component:FixtureIcon:{name}",
      1,
      "align-left",
      "align-center",
      "align-right",
      "currency",
      "percent",
    ),
    site('component:FixtureIcon:name="unfold-more"', 1, "unfold-more"),
    site('component:FixtureIcon:name="check"', 1, "check"),
    site(
      'component:FixtureIcon:name={direction === "up" ? "arrow-up" : "arrow-down"}',
      1,
      "arrow-up",
      "arrow-down",
    ),
    site('render:lineIcon("align-left")', 1, "align-left"),
    site('render:lineIcon("align-center")', 1, "align-center"),
    site('render:lineIcon("align-right")', 1, "align-right"),
    site('render:lineIcon("currency")', 1, "currency"),
    site('render:lineIcon("percent")', 1, "percent"),
    site("render:chevronsIcon()", 1, "unfold-more"),
    site('render:chevronIcon("up")', 1, "arrow-up"),
    site("render:checkIcon()", 1, "check"),
    site('render:chevronIcon("down")', 1, "arrow-down"),
  ],
  "tooltip.svelte": [
    site("render:boldIcon()", 2, "bold"),
    site("render:italicIcon()", 2, "italic"),
    site("render:underlineIcon()", 2, "underline"),
    site("render:linkIcon()", 1, "link"),
    site("render:mailIcon()", 1, "mail"),
    site("render:share2Icon()", 1, "share-2"),
    site('component:FixtureIcon:name="bold"', 1, "bold"),
    site('component:FixtureIcon:name="italic"', 1, "italic"),
    site('component:FixtureIcon:name="underline"', 1, "underline"),
    site('component:FixtureIcon:name="link"', 1, "link"),
    site('component:FixtureIcon:name="mail"', 1, "mail"),
    site('component:FixtureIcon:name="share-2"', 1, "share-2"),
  ],
} as const satisfies Record<(typeof migratedFixtures)[number], readonly SiteContract[]>;

const directCoreImports = {
  "autocomplete.svelte": ["Location01Icon", "Search01Icon"],
  "combobox.svelte": ["Cancel01Icon", "Search01Icon", "UnfoldMoreIcon"],
  "command.svelte": [
    "ArrowDown02Icon",
    "ArrowLeft02Icon",
    "ArrowUp02Icon",
    "CircleQuestionMarkIcon",
    "CornerDownLeftIcon",
    "Search01Icon",
    "SparklesIcon",
  ],
  "select.svelte": ["CableIcon", "CodeXmlIcon", "GlobeIcon", "LayersIcon", "ZapIcon"],
} as const;

const selectDataBindings = [
  '{ icon: LayersIcon, label: "Components", value: "components" }',
  '{ icon: ZapIcon, label: "Performance", value: "performance" }',
  '{ icon: GlobeIcon, label: "Network", value: "network" }',
  '{ icon: CodeXmlIcon, label: "Development", value: "development" }',
] as const;

function normalizeSource(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function walkAst(node: unknown, visit: (node: AstNode) => void): void {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (const child of node) walkAst(child, visit);
    return;
  }
  const astNode = node as AstNode;
  visit(astNode);
  for (const [key, child] of Object.entries(astNode)) {
    if (key === "loc" || key === "metadata") continue;
    walkAst(child, visit);
  }
}

function extractIconSites(source: string): Map<string, number> {
  const sites = new Map<string, number>();
  const add = (key: string): void => {
    sites.set(key, (sites.get(key) ?? 0) + 1);
  };

  walkAst(parse(source, { modern: true }), (node) => {
    if (
      node.type === "Component" &&
      (node.name === "FixtureIcon" || node.name === "HugeiconsIcon")
    ) {
      const bindingNames = node.name === "FixtureIcon" ? ["name"] : ["icon", "strokeWidth"];
      const bindings = bindingNames.map((bindingName) => {
        const binding = node.attributes?.find(
          (attribute) => attribute.type === "Attribute" && attribute.name === bindingName,
        );
        if (binding?.start === undefined || binding.end === undefined) {
          throw new Error(`${node.name} is missing its ${bindingName} binding`);
        }
        return normalizeSource(source.slice(binding.start, binding.end));
      });
      add(`component:${node.name}:${bindings.join(":")}`);
    }

    if (
      node.type === "RenderTag" &&
      node.expression?.start !== undefined &&
      node.expression.end !== undefined
    ) {
      const expression = normalizeSource(source.slice(node.expression.start, node.expression.end));
      if (/icon/i.test(expression)) add(`render:${expression}`);
    }
  });
  return sites;
}

function extractNamedImports(source: string, moduleName: string): string[] {
  const imports = new Set<string>();
  walkAst(parse(source, { modern: true }), (node) => {
    if (node.type !== "ImportDeclaration" || node.source?.value !== moduleName) {
      return;
    }
    for (const specifier of node.specifiers ?? []) {
      const name = specifier.imported?.name ?? specifier.local?.name;
      if (name) imports.add(name);
    }
  });
  return [...imports].sort();
}

function parseAttributes(value: string): Record<string, string> {
  return Object.fromEntries(
    [...value.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [
      match[1] as string,
      match[2] as string,
    ]),
  );
}

function assertOfficialGeometry(body: string, icon: IconData, label: string): void {
  const svgs = [...body.matchAll(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/g)];
  expect(svgs, `${label}: expected exactly one rendered icon`).toHaveLength(1);
  const svg = svgs[0];
  if (!svg) throw new Error(`${label}: missing rendered icon`);

  const svgAttributes = parseAttributes(svg[1] ?? "");
  expect(svgAttributes.viewBox, `${label}: wrong viewBox`).toBe("0 0 24 24");
  expect(svgAttributes["stroke-width"], `${label}: wrong root stroke width`).toBe("2");

  const actualNodes = [...(svg[2] ?? "").matchAll(/<(path|circle|ellipse|rect)\b([^>]*)>/g)].map(
    (match) => ({ attributes: parseAttributes(match[2] ?? ""), tag: match[1] }),
  );
  const expectedNodes = icon
    .filter(([tag]) => tag === "path" || tag === "circle" || tag === "ellipse" || tag === "rect")
    .map(([tag, sourceAttributes]) => {
      const attributes: Record<string, string> = {};
      for (const [attribute, value] of Object.entries(sourceAttributes)) {
        if (attribute === "key") continue;
        const htmlAttribute = attribute.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
        attributes[htmlAttribute] = String(value);
      }
      attributes["stroke-width"] = "2";
      return { attributes, tag };
    });

  expect(expectedNodes.length, `${label}: official dataset is empty`).toBeGreaterThan(0);
  expect(actualNodes, `${label}: wrong official Hugeicons glyph geometry`).toEqual(expectedNodes);
}

describe("parity fixture icon migration", () => {
  it("enumerates every fixture and keeps copied SVG markup only for theme illustrations", () => {
    const fixtureNames = Object.keys(fixtureModules)
      .map((path) => path.slice(2))
      .sort();

    for (const fileName of fixtureNames) {
      const source = readFileSync(resolve(fixtureRoot, fileName), "utf8");
      expect(source, fileName).not.toContain("@hugeicons/svelte");
      expect(source, fileName).not.toMatch(/lucide-/i);
      if (fileName === "radio-group.svelte") {
        expect(source.match(/<svg\b/g)).toHaveLength(3);
        expect(source.match(/viewBox="0 0 88 70"/g)).toHaveLength(3);
      } else {
        expect(source, fileName).not.toMatch(
          /<(?:svg|path|circle|ellipse|line|polyline|polygon)\b/i,
        );
      }
    }

    expect(migratedFixtures).toHaveLength(26);
    for (const fileName of migratedFixtures) {
      expect(fixtureNames).toContain(fileName);
      expect(readFileSync(resolve(fixtureRoot, fileName), "utf8"), fileName).toMatch(
        /(?:FixtureIcon|HugeiconsIcon)/,
      );
    }
  });

  it("binds all 204 icon component and snippet sites to exact official datasets", () => {
    let coveredSiteCount = 0;

    for (const fileName of migratedFixtures) {
      const source = readFileSync(resolve(fixtureRoot, fileName), "utf8");
      const actualSites = extractIconSites(source);
      const contract = fixtureIconContracts[fileName];
      const expectedSites = new Map(contract.map(({ count, key }) => [key, count]));

      expect(contract.length, `${fileName}: contract cannot be empty`).toBeGreaterThan(0);
      expect(actualSites, `${fileName}: icon render-site contract changed`).toEqual(expectedSites);

      for (const { count, icons, key } of contract) {
        expect(count, `${fileName}: ${key} has a vacuous count`).toBeGreaterThan(0);
        expect(icons.length, `${fileName}: ${key} has no official dataset`).toBeGreaterThan(0);
        coveredSiteCount += count;

        for (const iconName of icons) {
          const body = render(HugeiconsIcon, {
            props: { icon: officialIconData[iconName], strokeWidth: 2 },
          }).body;
          assertOfficialGeometry(
            body,
            officialIconData[iconName],
            `${fileName}: ${key}: ${iconName}`,
          );
        }
      }
    }

    expect(coveredSiteCount).toBe(204);
  });

  it("rejects changed or missing stroke-two bindings at every direct icon site", () => {
    let changedMutations = 0;
    let removedMutations = 0;

    for (const fileName of Object.keys(directCoreImports) as (keyof typeof directCoreImports)[]) {
      const source = readFileSync(resolve(fixtureRoot, fileName), "utf8");
      const contract = fixtureIconContracts[fileName];
      const expectedSites = new Map(contract.map(({ count, key }) => [key, count]));
      const expectedDirectCount = contract
        .filter(({ key }) => key.startsWith("component:HugeiconsIcon:"))
        .reduce((count, siteContract) => count + siteContract.count, 0);
      const strokeBindings = [...source.matchAll(/strokeWidth=\{2\}/g)];

      expect(strokeBindings, `${fileName}: direct stroke binding count`).toHaveLength(
        expectedDirectCount,
      );
      for (const binding of strokeBindings) {
        const index = binding.index;
        const changedSource = `${source.slice(0, index)}strokeWidth={1}${source.slice(index + binding[0].length)}`;
        expect(
          extractIconSites(changedSource),
          `${fileName}: changed stroke binding at ${index}`,
        ).not.toEqual(expectedSites);
        changedMutations += 1;

        const removedSource = `${source.slice(0, index)}${source.slice(index + binding[0].length)}`;
        expect(
          () => extractIconSites(removedSource),
          `${fileName}: removed stroke binding at ${index}`,
        ).toThrow("HugeiconsIcon is missing its strokeWidth binding");
        removedMutations += 1;
      }
    }

    expect(changedMutations).toBe(19);
    expect(removedMutations).toBe(19);
  });

  it("imports every direct fixture dataset from the official core package", () => {
    for (const [fileName, expectedImports] of Object.entries(directCoreImports)) {
      const source = readFileSync(resolve(fixtureRoot, fileName), "utf8");
      expect(extractNamedImports(source, "@hugeicons/core-free-icons"), fileName).toEqual(
        [...expectedImports].sort(),
      );
      expect(extractNamedImports(source, "@coss-sv/ui"), fileName).toContain("HugeiconsIcon");
    }

    const selectSource = normalizeSource(
      readFileSync(resolve(fixtureRoot, "select.svelte"), "utf8"),
    );
    for (const binding of selectDataBindings) {
      expect(selectSource, `select.svelte: missing ${binding}`).toContain(binding);
    }
  });

  it("emits exact official geometry at stroke two for every semantic helper mapping", () => {
    for (const [name, icon] of Object.entries(semanticIconData)) {
      const body = render(FixtureIcon, { props: { name: name as FixtureIconName } }).body;
      assertOfficialGeometry(body, icon, name);
    }
  });

  it("server-renders the Sidebar trigger with the official SidebarLeft geometry", () => {
    const source = readFileSync(
      resolve(packageRoot, "components/ui/sidebar/sidebar-trigger.svelte"),
      "utf8",
    );
    expect(
      source.match(/<HugeiconsIcon\b/g),
      "sidebar-trigger.svelte: renderer count",
    ).toHaveLength(1);
    expect(source).toContain(
      'import SidebarLeftIcon from "@hugeicons/core-free-icons/SidebarLeftIcon"',
    );
    expect(source).toContain('import HugeiconsIcon from "$lib/hugeicons-icon.svelte"');
    expect(source).not.toContain("@hugeicons/svelte");
    expect(source).toContain("icon={SidebarLeftIcon}");

    const body = render(SidebarIconSsrFixture).body;
    assertOfficialGeometry(body, SidebarLeftIcon, "sidebar-trigger.svelte");
  });

  it("keeps the literal accessible space after the COSS command prompt label", () => {
    const source = readFileSync(resolve(fixtureRoot, "command.svelte"), "utf8");
    expect(source).toContain('You asked: {" "}<span>');
  });
});
