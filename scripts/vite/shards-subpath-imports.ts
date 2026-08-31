const packageName = "@shardsui/svelte";
const exportModules: Readonly<Record<string, string>> = {
  Accordion: "accordion",
  AlertDialog: "alert-dialog",
  Autocomplete: "autocomplete",
  Avatar: "avatar",
  Button: "button",
  Checkbox: "checkbox",
  CheckboxGroup: "checkbox-group",
  Collapsible: "collapsible",
  Combobox: "combobox",
  ContextMenu: "context-menu",
  Dialog: "dialog",
  DirectionProvider: "direction-provider",
  Drawer: "drawer",
  Field: "field",
  Fieldset: "fieldset",
  Form: "form",
  Input: "input",
  ImageLoadingStatus: "avatar",
  Menu: "menu",
  Meter: "meter",
  Popover: "popover",
  PreviewCard: "preview-card",
  Progress: "progress",
  ProgressStatus: "progress",
  Radio: "radio",
  RadioGroup: "radio-group",
  ScrollArea: "scroll-area",
  Select: "select",
  Separator: "separator",
  Slider: "slider",
  Switch: "switch",
  Tabs: "tabs",
  TabsActivationDirection: "tabs",
  TabsOrientation: "tabs",
  TabsValue: "tabs",
  Toast: "toast",
  ToastManager: "toast",
  ToastManagerAddOptions: "toast",
  ToastManagerPositionerProps: "toast",
  ToastManagerUpdateOptions: "toast",
  ToastObject: "toast",
  Toggle: "toggle",
  ToggleGroup: "toggle-group",
  Toolbar: "toolbar",
  Tooltip: "tooltip",
};

const namedImport = new RegExp(
  `^([\\t ]*)import\\s+(type\\s+)?\\{([^}]*)\\}\\s*from\\s*["']${packageName}["'];?`,
  "gm",
);
const namedExport = new RegExp(
  `^([\\t ]*)export\\s+(type\\s+)?\\{([^}]*)\\}\\s*from\\s*["']${packageName}["'];?`,
  "gm",
);

function rewriteNamedStatement(
  statement: string,
  indentation: string,
  typeOnly: string,
  body: string,
  keyword: "export" | "import",
): string {
  const groups = new Map<string, string[]>();
  for (const entry of body
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)) {
    const symbol = entry.replace(/^type\s+/, "").split(/\s+as\s+/)[0];
    const module = exportModules[symbol];
    if (!module) return statement;
    const entries = groups.get(module) ?? [];
    entries.push(entry);
    groups.set(module, entries);
  }
  return [...groups]
    .map(
      ([module, entries]) =>
        `${indentation}${keyword} ${typeOnly}{ ${entries.join(", ")} } from "${packageName}/${module}";`,
    )
    .join("\n");
}

export function rewriteShardsImports(source: string): string {
  return source
    .replace(
      namedImport,
      (statement, indentation: string, typeOnly: string | undefined, body: string) =>
        rewriteNamedStatement(statement, indentation, typeOnly ?? "", body, "import"),
    )
    .replace(
      namedExport,
      (statement, indentation: string, typeOnly: string | undefined, body: string) =>
        rewriteNamedStatement(statement, indentation, typeOnly ?? "", body, "export"),
    );
}
