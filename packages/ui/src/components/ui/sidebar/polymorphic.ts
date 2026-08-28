import type { SvelteHTMLElements } from "svelte/elements";

type NativeKeys<Tag extends keyof SvelteHTMLElements> = Tag extends Tag
  ? keyof SvelteHTMLElements[Tag]
  : never;

export type SidebarPolymorphicDiscriminator<
  SupportedTag extends keyof SvelteHTMLElements,
  Tag extends SupportedTag,
  DefaultTag extends SupportedTag,
> = (Tag extends DefaultTag ? { as?: Tag } : { as: Tag }) &
  Partial<
    Record<Exclude<NativeKeys<Exclude<SupportedTag, Tag>>, keyof SvelteHTMLElements[Tag]>, never>
  >;
