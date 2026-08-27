import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import ts from "typescript";
import { describe, expect, test } from "vitest";

const packageRoot = process.cwd();
const componentRoot = join(packageRoot, "dist", "components", "ui");
const wrappers = {
  "context-menu": [
    "checkbox-item",
    "group-label",
    "group",
    "item",
    "link-item",
    "popup",
    "radio-group",
    "radio-item",
    "root",
    "separator",
    "shortcut",
    "sub-popup",
    "sub-trigger",
    "sub",
    "trigger",
  ],
  menu: [
    "checkbox-item",
    "group-label",
    "group",
    "item",
    "link-item",
    "popup",
    "radio-group",
    "radio-item",
    "root",
    "separator",
    "shortcut",
    "sub-popup",
    "sub-trigger",
    "sub",
    "trigger",
  ],
  toolbar: ["button", "group", "input", "link", "root", "separator"],
} as const;

function modulePath(from: string, path: string): string {
  const result = relative(from, path).split(sep).join("/");
  return result.startsWith(".") ? result : `./${result}`;
}

describe("built Menu, ContextMenu, and Toolbar declarations", () => {
  test("emits declarations for every public Svelte wrapper", async () => {
    for (const [namespace, parts] of Object.entries(wrappers)) {
      for (const part of parts) {
        const declaration = join(componentRoot, namespace, `${namespace}-${part}.svelte.d.ts`);
        await expect(stat(declaration)).resolves.toMatchObject({ size: expect.any(Number) });
        expect((await readFile(declaration, "utf8")).trim().length).toBeGreaterThan(0);
      }
    }
  });

  test("strictly compiles every canonical wrapper and named prop type from built output", async () => {
    const scratch = await mkdtemp(join(packageRoot, ".svelte-kit", "public-declarations-"));
    const consumer = join(scratch, "consumer.ts");
    const menu = modulePath(scratch, join(componentRoot, "menu", "index.js"));
    const contextMenu = modulePath(scratch, join(componentRoot, "context-menu", "index.js"));
    const toolbar = modulePath(scratch, join(componentRoot, "toolbar", "index.js"));

    await writeFile(
      consumer,
      `import * as Menu from ${JSON.stringify(menu)};
import * as ContextMenu from ${JSON.stringify(contextMenu)};
import * as Toolbar from ${JSON.stringify(toolbar)};

type Payload = { projectId: string; permission: "read" | "write" };
const handle = new Menu.Handle<Payload>();
const trigger: Menu.MenuTriggerProps<Payload> = {
  handle,
  payload: { projectId: "coss", permission: "write" },
};
const root: Menu.MenuRootProps<Payload> = { handle };
const rootState: Menu.MenuRootState<Payload> = { payload: trigger.payload };
const menuTypes: [
  Menu.MenuCheckboxItemProps,
  Menu.MenuCheckableItemState,
  Menu.MenuGroupLabelProps,
  Menu.MenuGroupProps,
  Menu.MenuItemProps,
  Menu.MenuLinkItemProps,
  Menu.MenuPopupProps,
  Menu.MenuRadioGroupProps<Payload>,
  Menu.MenuRadioItemProps,
  Menu.MenuSeparatorProps,
  Menu.MenuShortcutProps,
  Menu.MenuSubPopupProps,
  Menu.MenuSubProps,
  Menu.MenuSubTriggerProps,
  Menu.MenuTriggerState,
] = null as never;
const menuParts = [Menu.Root, Menu.Trigger, Menu.Popup, Menu.Group, Menu.GroupLabel,
  Menu.Item, Menu.LinkItem, Menu.CheckboxItem, Menu.RadioGroup, Menu.RadioItem,
  Menu.Separator, Menu.Shortcut, Menu.Sub, Menu.SubTrigger, Menu.SubPopup] as const;

const contextTypes: [
  ContextMenu.ContextMenuCheckboxItemProps,
  ContextMenu.ContextMenuGroupLabelProps,
  ContextMenu.ContextMenuGroupProps,
  ContextMenu.ContextMenuItemProps,
  ContextMenu.ContextMenuLinkItemProps,
  ContextMenu.ContextMenuPopupProps,
  ContextMenu.ContextMenuRadioGroupProps<Payload>,
  ContextMenu.ContextMenuRadioItemProps,
  ContextMenu.ContextMenuRootProps,
  ContextMenu.ContextMenuSeparatorProps,
  ContextMenu.ContextMenuShortcutProps,
  ContextMenu.ContextMenuSubPopupProps,
  ContextMenu.ContextMenuSubProps,
  ContextMenu.ContextMenuSubTriggerProps,
  ContextMenu.ContextMenuTriggerProps,
  ContextMenu.ContextMenuTriggerState,
] = null as never;
const contextParts = [ContextMenu.Root, ContextMenu.Trigger, ContextMenu.Popup,
  ContextMenu.Group, ContextMenu.GroupLabel, ContextMenu.Item, ContextMenu.LinkItem,
  ContextMenu.CheckboxItem, ContextMenu.RadioGroup, ContextMenu.RadioItem,
  ContextMenu.Separator, ContextMenu.Shortcut, ContextMenu.Sub,
  ContextMenu.SubTrigger, ContextMenu.SubPopup] as const;

const toolbarTypes: [Toolbar.ToolbarButtonProps, Toolbar.ToolbarGroupProps,
  Toolbar.ToolbarInputProps, Toolbar.ToolbarLinkProps, Toolbar.ToolbarLinkState,
  Toolbar.ToolbarOrientation, Toolbar.ToolbarRootProps, Toolbar.ToolbarRootState,
  Toolbar.ToolbarSeparatorProps] = null as never;
const toolbarParts = [Toolbar.Root, Toolbar.Button, Toolbar.Group, Toolbar.Input,
  Toolbar.Link, Toolbar.Separator] as const;

void [root, rootState, menuTypes, menuParts, contextTypes, contextParts, toolbarTypes, toolbarParts];
`,
      "utf8",
    );

    const program = ts.createProgram([consumer], {
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      noEmit: true,
      skipLibCheck: true,
      strict: true,
      target: ts.ScriptTarget.ES2022,
    });
    const diagnostics = ts.getPreEmitDiagnostics(program);
    const formatted = ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCanonicalFileName: (fileName) => fileName,
      getCurrentDirectory: () => packageRoot,
      getNewLine: () => "\n",
    });

    await rm(scratch, { force: true, recursive: true });
    expect(formatted).toBe("");
  });
});
