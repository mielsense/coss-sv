import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  Add01Icon,
  AlertCircleIcon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowTurnBackwardIcon,
  ArrowUp01Icon,
  Bookmark02Icon,
  BookOpen01Icon,
  BoxIcon,
  Cancel01Icon,
  ChevronDownIcon,
  CopyIcon,
  Delete02Icon,
  DollarSignIcon,
  Download01Icon,
  FloppyDiskIcon,
  Folder01Icon,
  House01Icon,
  InboxIcon,
  InformationCircleIcon,
  Link01Icon,
  Mail01Icon,
  MinusSignIcon,
  MoreHorizontalIcon,
  NextIcon,
  Notification02Icon,
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
} from "@hugeicons/core-free-icons";
import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import SidebarIconSsrFixture from "../../../../tests/fixtures/sidebar-icon-ssr-fixture.svelte";
import FixtureIcon, { type FixtureIconName } from "./fixture-icon.svelte";

type IconData = readonly (readonly [string, Readonly<Record<string, string | number>>])[];
type FixtureModule = { default: Parameters<typeof render>[0] };

const fixtureRoot = import.meta.dirname;
const packageRoot = resolve(fixtureRoot, "../../../../../../packages/ui/src");
const fixtureModules = import.meta.glob<FixtureModule>("./*.svelte", { eager: true });

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
  "arrow-left": ArrowLeft01Icon,
  "arrow-right": ArrowRight01Icon,
  "arrow-up": ArrowUp01Icon,
  bell: Notification02Icon,
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

const fixtureSemanticNames = {
  "alert.svelte": ["info-circle"],
  "autocomplete.svelte": [],
  "badge.svelte": ["check"],
  "button.svelte": ["plus", "download"],
  "card.svelte": [
    "unfold-more",
    "arrow-up",
    "check",
    "arrow-down",
    "alert-circle",
    "plus",
    "folder",
  ],
  "collapsible.svelte": ["chevron-down", "trash"],
  "combobox.svelte": [],
  "command.svelte": [],
  "context-menu.svelte": ["pencil", "copy", "share", "trash"],
  "drawer.svelte": ["more", "pencil", "copy", "share", "trash"],
  "empty.svelte": ["route", "book"],
  "field.svelte": ["arrow-right"],
  "group.svelte": ["zoom-in", "zoom-out", "arrow-left", "arrow-right", "plus"],
  "input-group.svelte": [
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
  ],
  "menu.svelte": ["play", "pause", "previous", "next", "trash"],
  "number-field.svelte": ["unfold-more", "arrow-up", "check", "arrow-down", "arrow-right", "reset"],
  "popover.svelte": ["cancel", "bell", "user", "arrow-down"],
  "preview-card.svelte": ["star", "redo"],
  "select.svelte": [],
  "slider.svelte": ["volume-mute", "volume-high", "minus", "plus-sign"],
  "tabs.svelte": ["home", "panels", "settings", "package", "inbox"],
  "toast.svelte": ["check", "copy", "download", "save"],
  "toggle-group.svelte": ["bold", "italic", "underline"],
  "toggle.svelte": ["bold", "italic", "underline", "bookmark"],
  "toolbar.svelte": [
    "align-left",
    "align-center",
    "align-right",
    "currency",
    "percent",
    "unfold-more",
    "check",
    "arrow-up",
    "arrow-down",
  ],
  "tooltip.svelte": ["bold", "italic", "underline", "link", "mail", "share-2"],
} as const satisfies Record<(typeof migratedFixtures)[number], readonly FixtureIconName[]>;

const directFixtureFragments = {
  "autocomplete.svelte": ["icon={MapPinIcon}", "icon={Search01Icon}"],
  "combobox.svelte": ["icon={Cancel01Icon}", "icon={Search01Icon}", "icon={UnfoldMoreIcon}"],
  "command.svelte": [
    "icon={ArrowDown02Icon}",
    "icon={ArrowLeft02Icon}",
    "icon={ArrowUp02Icon}",
    "icon={CircleQuestionMarkIcon}",
    "icon={CornerDownLeftIcon}",
    "icon={Search01Icon}",
    "icon={SparklesIcon}",
  ],
  "select.svelte": [
    "icon={CableIcon}",
    '{ icon: LayersIcon, label: "Components"',
    '{ icon: ZapIcon, label: "Performance"',
    '{ icon: GlobeIcon, label: "Network"',
    '{ icon: CodeXmlIcon, label: "Development"',
    "icon={item.icon}",
  ],
} as const;

function assertOfficialGeometry(body: string, icon: IconData, label: string): void {
  for (const [tag, attributes] of icon) {
    expect(body, `${label}: missing <${tag}>`).toContain(`<${tag}`);
    for (const [attribute, value] of Object.entries(attributes)) {
      if (
        attribute === "key" ||
        attribute === "stroke" ||
        attribute === "strokeLinecap" ||
        attribute === "strokeLinejoin" ||
        attribute === "strokeWidth"
      ) {
        continue;
      }
      const htmlAttribute = attribute.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
      expect(body, `${label}: missing ${htmlAttribute}`).toContain(`${htmlAttribute}="${value}"`);
    }
  }
  expect(body, `${label}: wrong viewBox`).toContain('viewBox="0 0 24 24"');
  expect(body, `${label}: wrong stroke width`).toContain('stroke-width="2"');
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

  it("binds every fixture to the exact COSS semantic icon names", () => {
    for (const [fileName, iconNames] of Object.entries(fixtureSemanticNames)) {
      const source = readFileSync(resolve(fixtureRoot, fileName), "utf8");
      for (const iconName of iconNames) {
        expect(source, `${fileName}: missing ${iconName}`).toContain(`"${iconName}"`);
      }
    }

    for (const [fileName, fragments] of Object.entries(directFixtureFragments)) {
      const source = readFileSync(resolve(fixtureRoot, fileName), "utf8");
      for (const fragment of fragments) {
        expect(source, `${fileName}: missing ${fragment}`).toContain(fragment);
      }
    }
  });

  it("emits the exact official Hugeicons geometry at stroke two for every semantic mapping", () => {
    for (const [name, icon] of Object.entries(semanticIconData)) {
      const body = render(FixtureIcon, { props: { name: name as FixtureIconName } }).body;
      assertOfficialGeometry(body, icon, name);
    }
  });

  it("server-renders all 26 migrated fixtures with stroke-two icons", () => {
    for (const fileName of migratedFixtures) {
      const component = fixtureModules[`./${fileName}`]?.default;
      if (!component) throw new Error(`Missing parity fixture module: ${fileName}`);
      const body = render(component, { props: {} }).body;
      for (const svg of body.matchAll(/<svg\b[\s\S]*?<\/svg>/g)) {
        expect(svg[0], fileName).toContain('viewBox="0 0 24 24"');
        expect(svg[0], fileName).toContain('stroke-width="2"');
      }
    }
  });

  it("server-renders the Sidebar trigger with the official SidebarLeft geometry", () => {
    const source = readFileSync(
      resolve(packageRoot, "components/ui/sidebar/sidebar-trigger.svelte"),
      "utf8",
    );
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
