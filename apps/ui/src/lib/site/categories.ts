export type ComponentCategory = {
  slug: string;
  name: string;
  docsName?: string;
  description: string;
  isNew?: boolean;
};

// Pinned to reference/apps/ui/content/docs/components/meta.json and the page
// frontmatter at COSS commit 19620ae8cae81e30775f2cde03829326cb4916b2.
export const componentCategories: readonly ComponentCategory[] = [
  {
    slug: "accordion",
    name: "Accordion",
    description: "A set of collapsible panels with headings and content.",
  },
  { slug: "alert", name: "Alert", description: "A callout for displaying important information." },
  {
    slug: "alert-dialog",
    name: "Alert Dialog",
    description: "A dialog that requires user response to proceed.",
  },
  {
    slug: "autocomplete",
    name: "Autocomplete",
    description: "An input that suggests options as you type.",
  },
  {
    slug: "avatar",
    name: "Avatar",
    description: "An image element with a fallback for representing the user.",
  },
  { slug: "badge", name: "Badge", description: "A badge or a component that looks like a badge." },
  {
    slug: "breadcrumb",
    name: "Breadcrumb",
    description: "Displays the path to the current resource using a hierarchy of links.",
  },
  {
    slug: "button",
    name: "Button",
    description: "A button or a component that looks like a button.",
  },
  {
    slug: "calendar",
    name: "Calendar",
    description: "A date picker component with range and multi-select support.",
  },
  {
    slug: "card",
    name: "Card",
    description: "A content container for grouping related information.",
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    description: "A control allowing the user to toggle between checked and not checked.",
  },
  {
    slug: "checkbox-group",
    name: "Checkbox Group",
    description: "Provides shared state to a series of checkboxes.",
  },
  {
    slug: "collapsible",
    name: "Collapsible",
    description: "A collapsible panel controlled by a button trigger.",
  },
  {
    slug: "combobox",
    name: "Combobox",
    description: "An input combined with a list of predefined items to select.",
  },
  {
    slug: "command",
    name: "Command",
    description:
      "A command palette component built with Dialog and Autocomplete for searching and executing commands.",
  },
  {
    slug: "context-menu",
    name: "Context Menu",
    description: "A menu that appears at the pointer on right click or long press.",
  },
  {
    slug: "date-picker",
    name: "Date Picker",
    description: "A date picker component built with Calendar and Popover.",
  },
  { slug: "dialog", name: "Dialog", description: "A popup that opens on top of the entire page." },
  {
    slug: "drawer",
    name: "Drawer",
    description:
      "A panel that slides in from the edge of the screen with swipe gestures, snap points, and nested drawer support.",
  },
  {
    slug: "empty",
    name: "Empty",
    description: "A container for displaying empty state information.",
  },
  {
    slug: "field",
    name: "Field",
    description: "A component that provides labelling and validation for form controls.",
  },
  { slug: "fieldset", name: "Fieldset", description: "A native fieldset element with a legend." },
  {
    slug: "form",
    name: "Form",
    description: "A form wrapper component that simplifies validation and submission.",
  },
  {
    slug: "frame",
    name: "Frame",
    description: "A framed container for grouping related information.",
  },
  {
    slug: "group",
    name: "Group",
    description: "A component for visually grouping a series of controls.",
  },
  { slug: "input", name: "Input", description: "A native input element." },
  {
    slug: "input-group",
    name: "Input Group",
    description:
      "A flexible component for grouping inputs with addons, buttons, and other elements.",
  },
  {
    slug: "kbd",
    name: "Kbd",
    description: "A component for displaying keyboard keys and shortcuts.",
  },
  {
    slug: "label",
    name: "Label",
    description: "Renders an accessible label associated with controls.",
  },
  {
    slug: "menu",
    name: "Menu",
    description: "A list of actions in a dropdown, enhanced with keyboard navigation.",
  },
  {
    slug: "meter",
    name: "Meter",
    description: "A graphical display of a numeric value within a range.",
  },
  {
    slug: "number-field",
    name: "Number Field",
    description: "A numeric input element with increment and decrement buttons, and a scrub area.",
  },
  {
    slug: "otp-field",
    name: "Otp Field",
    docsName: "OTP Field",
    description: "A segmented input for one-time passwords and verification codes.",
  },
  {
    slug: "pagination",
    name: "Pagination",
    description: "A pagination with page navigation, next and previous links.",
  },
  { slug: "popover", name: "Popover", description: "An accessible popup anchored to a button." },
  {
    slug: "preview-card",
    name: "Preview Card",
    description:
      "A popup that appears when a link is hovered, showing a preview for sighted users.",
  },
  {
    slug: "progress",
    name: "Progress",
    description: "Displays the status of a task that takes a long time.",
  },
  {
    slug: "radio-group",
    name: "Radio Group",
    description:
      "A set of checkable buttons where no more than one of the buttons can be checked at a time.",
  },
  {
    slug: "scroll-area",
    name: "Scroll Area",
    description: "A native scroll container with custom scrollbars.",
  },
  {
    slug: "select",
    name: "Select",
    description: "A common form component for choosing a predefined value in a dropdown menu.",
  },
  {
    slug: "segmented-control",
    name: "Segmented Control",
    description:
      "A visual pattern for presenting related choices, navigation destinations, filters, or content views.",
    isNew: true,
  },
  {
    slug: "separator",
    name: "Separator",
    description: "A separator element accessible to screen readers.",
  },
  {
    slug: "sheet",
    name: "Sheet",
    description: "A flyout that opens from the side of the screen, based on the dialog component.",
  },
  {
    slug: "skeleton",
    name: "Skeleton",
    description: "A loading state skeleton for your components.",
  },
  {
    slug: "slider",
    name: "Slider",
    description: "An input where the user selects a value from within a given range.",
  },
  {
    slug: "spinner",
    name: "Spinner",
    description: "An indicator that can be used to show a loading state.",
  },
  {
    slug: "switch",
    name: "Switch",
    description: "A control that indicates whether a setting is on or off.",
  },
  {
    slug: "table",
    name: "Table",
    description: "A simple table component for displaying tabular data.",
  },
  {
    slug: "tabs",
    name: "Tabs",
    description: "A component for toggling between related panels on the same page.",
  },
  { slug: "textarea", name: "Textarea", description: "A native textarea element." },
  {
    slug: "toast",
    name: "Toast",
    description: "A temporary notification that appears on screen to inform users.",
  },
  {
    slug: "toggle",
    name: "Toggle",
    description: "A two-state button that can be toggled on or off.",
  },
  {
    slug: "toggle-group",
    name: "Toggle Group",
    description: "Provides a shared state to a series of toggle buttons.",
  },
  {
    slug: "toolbar",
    name: "Toolbar",
    description: "A container for grouping a set of buttons and controls.",
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    description:
      "A popup that appears when an element is hovered or focused, showing a hint for sighted users.",
  },
] as const;
