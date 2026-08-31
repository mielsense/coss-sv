import { ScrollArea as ScrollAreaPrimitive } from "@shardsui/svelte/scroll-area";

export { ScrollAreaPrimitive };
export const Root: typeof ScrollAreaPrimitive.Root = ScrollAreaPrimitive.Root;
export const Viewport: typeof ScrollAreaPrimitive.Viewport = ScrollAreaPrimitive.Viewport;
export const Content: typeof ScrollAreaPrimitive.Content = ScrollAreaPrimitive.Content;
export const Scrollbar: typeof ScrollAreaPrimitive.Scrollbar = ScrollAreaPrimitive.Scrollbar;
export const Thumb: typeof ScrollAreaPrimitive.Thumb = ScrollAreaPrimitive.Thumb;
export const Corner: typeof ScrollAreaPrimitive.Corner = ScrollAreaPrimitive.Corner;
export type { ScrollAreaProps } from "./scroll-area.svelte";
export { default as ScrollArea } from "./scroll-area.svelte";
export type { ScrollBarProps } from "./scroll-bar.svelte";
export { default as ScrollBar } from "./scroll-bar.svelte";
