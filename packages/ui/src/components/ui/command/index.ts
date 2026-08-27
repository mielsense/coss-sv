import { Autocomplete as A, Dialog as D } from "@shardsui/svelte";
export { D as CommandDialogPrimitive };
export { default as Root, default as Command } from "./command-root.svelte";
export type { CommandRootProps } from "./command-root.svelte";
export const Collection: typeof A.Collection = A.Collection;
export const CommandCollection: typeof A.Collection = Collection;
export const Value: typeof A.Value = A.Value;
export const CommandValue: typeof A.Value = Value;
export const DialogRoot: typeof D.Root = D.Root;
export const CommandDialog: typeof D.Root = DialogRoot;
export const DialogPortal: typeof D.Portal = D.Portal;
export const CommandDialogPortal: typeof D.Portal = DialogPortal;
export const Handle: typeof D.Handle = D.Handle;
export const CommandDialogHandle: typeof D.Handle = Handle;
export function createHandle<Payload = unknown>() {
  return new D.Handle<Payload>();
}
export const CommandCreateHandle = createHandle;
export {
  default as DialogBackdrop,
  default as CommandDialogBackdrop,
} from "./command-dialog-backdrop.svelte";
export type { CommandDialogBackdropProps } from "./command-dialog-backdrop.svelte";
export {
  default as DialogViewport,
  default as CommandDialogViewport,
} from "./command-dialog-viewport.svelte";
export type { CommandDialogViewportProps } from "./command-dialog-viewport.svelte";
export {
  default as DialogTrigger,
  default as CommandDialogTrigger,
} from "./command-dialog-trigger.svelte";
export type { CommandDialogTriggerProps } from "./command-dialog-trigger.svelte";
export {
  default as DialogPopup,
  default as CommandDialogPopup,
} from "./command-dialog-popup.svelte";
export type { CommandDialogPopupProps } from "./command-dialog-popup.svelte";
export { default as Input, default as CommandInput } from "./command-input.svelte";
export type { CommandInputProps } from "./command-input.svelte";
export { default as List, default as CommandList } from "./command-list.svelte";
export type { CommandListProps } from "./command-list.svelte";
export { default as Empty, default as CommandEmpty } from "./command-empty.svelte";
export type { CommandEmptyProps } from "./command-empty.svelte";
export { default as Group, default as CommandGroup } from "./command-group.svelte";
export { default as GroupLabel, default as CommandGroupLabel } from "./command-group-label.svelte";
export { default as Item, default as CommandItem } from "./command-item.svelte";
export type { CommandItemProps } from "./command-item.svelte";
export { default as Separator, default as CommandSeparator } from "./command-separator.svelte";
export type { CommandSeparatorProps } from "./command-separator.svelte";
export { default as Panel, default as CommandPanel } from "./command-panel.svelte";
export type { CommandPanelProps } from "./command-panel.svelte";
export { default as Shortcut, default as CommandShortcut } from "./command-shortcut.svelte";
export type { CommandShortcutProps } from "./command-shortcut.svelte";
export { default as Footer, default as CommandFooter } from "./command-footer.svelte";
export type { CommandFooterProps } from "./command-footer.svelte";
