import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, expect, test } from "vitest";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");
const distRoot = join(packageRoot, "dist/components/ui");
const svelteCheck = join(packageRoot, "node_modules/.bin/svelte-check");

const publicParts = {
  "alert-dialog": [
    ["alert-dialog-backdrop", "AlertDialogBackdropProps"],
    ["alert-dialog-close", "AlertDialogCloseProps"],
    ["alert-dialog-description", "AlertDialogDescriptionProps"],
    ["alert-dialog-footer", "AlertDialogFooterProps"],
    ["alert-dialog-header", "AlertDialogHeaderProps"],
    ["alert-dialog-popup", "AlertDialogPopupProps"],
    ["alert-dialog-title", "AlertDialogTitleProps"],
    ["alert-dialog-trigger", "AlertDialogTriggerProps"],
    ["alert-dialog-viewport", "AlertDialogViewportProps"],
  ],
  dialog: [
    ["dialog-backdrop", "DialogBackdropProps"],
    ["dialog-close", "DialogCloseProps"],
    ["dialog-description", "DialogDescriptionProps"],
    ["dialog-footer", "DialogFooterProps"],
    ["dialog-header", "DialogHeaderProps"],
    ["dialog-panel", "DialogPanelProps"],
    ["dialog-popup", "DialogPopupProps"],
    ["dialog-title", "DialogTitleProps"],
    ["dialog-trigger", "DialogTriggerProps"],
    ["dialog-viewport", "DialogViewportProps"],
  ],
  drawer: [
    ["drawer-backdrop", "DrawerBackdropProps"],
    ["drawer-bar", "DrawerBarProps"],
    ["drawer-close", "DrawerCloseProps"],
    ["drawer-content", "DrawerContentProps"],
    ["drawer-description", "DrawerDescriptionProps"],
    ["drawer-footer", "DrawerFooterProps"],
    ["drawer-header", "DrawerHeaderProps"],
    ["drawer-menu-checkbox-item", "DrawerMenuCheckboxItemProps"],
    ["drawer-menu-group-label", "DrawerMenuGroupLabelProps"],
    ["drawer-menu-group", "DrawerMenuGroupProps"],
    ["drawer-menu-item", "DrawerMenuItemProps"],
    ["drawer-menu-radio-group", "DrawerMenuRadioGroupProps"],
    ["drawer-menu-radio-item", "DrawerMenuRadioItemProps"],
    ["drawer-menu-separator", "DrawerMenuSeparatorProps"],
    ["drawer-menu-trigger", "DrawerMenuTriggerProps"],
    ["drawer-menu", "DrawerMenuProps"],
    ["drawer-panel", "DrawerPanelProps"],
    ["drawer-popup", "DrawerPopupProps"],
    ["drawer-root", "DrawerRootProps"],
    ["drawer-swipe-area", "DrawerSwipeAreaProps"],
    ["drawer-title", "DrawerTitleProps"],
    ["drawer-trigger", "DrawerTriggerProps"],
    ["drawer-viewport", "DrawerViewportProps"],
  ],
  sheet: [
    ["sheet-backdrop", "SheetBackdropProps"],
    ["sheet-close", "SheetCloseProps"],
    ["sheet-description", "SheetDescriptionProps"],
    ["sheet-footer", "SheetFooterProps"],
    ["sheet-header", "SheetHeaderProps"],
    ["sheet-panel", "SheetPanelProps"],
    ["sheet-popup", "SheetPopupProps"],
    ["sheet-title", "SheetTitleProps"],
    ["sheet-trigger", "SheetTriggerProps"],
    ["sheet-viewport", "SheetViewportProps"],
  ],
} as const;

let consumerRoot: string | undefined;

beforeAll(() => {
  if (!existsSync(join(distRoot, "dialog/index.d.ts"))) {
    execFileSync("pnpm", ["build"], { cwd: packageRoot, stdio: "pipe" });
  }
});

afterAll(() => {
  if (consumerRoot) rmSync(consumerRoot, { force: true, recursive: true });
});

test("emits a declaration and named prop type for every public overlay wrapper", () => {
  for (const [family, parts] of Object.entries(publicParts)) {
    const barrel = readFileSync(join(distRoot, family, "index.d.ts"), "utf8");
    for (const [part, propType] of parts) {
      const declaration = join(distRoot, family, `${part}.svelte.d.ts`);
      expect(existsSync(declaration), `${family}/${part}.svelte.d.ts`).toBe(true);
      expect(readFileSync(declaration, "utf8")).toContain(`export type ${propType}`);
      expect(barrel).toContain(propType);
    }
  }
});

test("type-checks the built overlay surface from a strict Svelte consumer", () => {
  consumerRoot = mkdtempSync(join(tmpdir(), "coss-overlay-consumer-"));
  symlinkSync(join(packageRoot, "node_modules"), join(consumerRoot, "node_modules"), "dir");
  writeFileSync(
    join(consumerRoot, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        allowJs: true,
        checkJs: true,
        isolatedModules: true,
        module: "esnext",
        moduleResolution: "bundler",
        skipLibCheck: true,
        strict: true,
        target: "es2022",
        verbatimModuleSyntax: true,
      },
      include: ["App.svelte"],
    }),
  );

  const imports = Object.keys(publicParts)
    .map((family) => {
      const namespace = family
        .split("-")
        .map((word) => word[0]?.toUpperCase() + word.slice(1))
        .join("");
      return `import * as ${namespace} from ${JSON.stringify(join(distRoot, family, "index.js"))};`;
    })
    .join("\n");
  const contracts = Object.entries(publicParts)
    .flatMap(([family, parts]) => {
      const namespace = family
        .split("-")
        .map((word) => word[0]?.toUpperCase() + word.slice(1))
        .join("");
      return parts.map(([, propType]) => `${namespace}.${propType}`);
    })
    .join(",\n    ");

  writeFileSync(
    join(consumerRoot, "App.svelte"),
    `<script lang="ts">
${imports}
const dialog = Dialog.createHandle<{ id: number }>();
const alert = AlertDialog.createHandle<{ id: number }>();
const sheet = Sheet.createHandle<{ id: number }>();
const drawer = Drawer.createHandle<{ id: number }>();
type PublicOverlayProps = [
    ${contracts}
];
let publicOverlayProps!: PublicOverlayProps;
</script>
<span hidden>{publicOverlayProps.length}</span>
<Dialog.Trigger handle={dialog} payload={{ id: 1 }}>Dialog</Dialog.Trigger>
<Dialog.Root handle={dialog}>{#snippet children({ payload })}{payload?.id}{/snippet}</Dialog.Root>
<AlertDialog.Trigger handle={alert} payload={{ id: 1 }}>Alert</AlertDialog.Trigger>
<AlertDialog.Root handle={alert}>{#snippet children({ payload })}{payload?.id}{/snippet}</AlertDialog.Root>
<Sheet.Trigger handle={sheet} payload={{ id: 1 }}>Sheet</Sheet.Trigger>
<Sheet.Root handle={sheet}>{#snippet children({ payload })}{payload?.id}{/snippet}</Sheet.Root>
<Drawer.Trigger handle={drawer} payload={{ id: 1 }}>Drawer</Drawer.Trigger>
<Drawer.Root handle={drawer}>{#snippet children({ payload })}{payload?.id}{/snippet}</Drawer.Root>
`,
  );

  const workspace = consumerRoot;
  expect(() =>
    execFileSync(svelteCheck, ["--workspace", workspace, "--tsconfig", "tsconfig.json"], {
      cwd: workspace,
      stdio: "pipe",
    }),
  ).not.toThrow();
});
