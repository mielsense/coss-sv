<script module lang="ts">
  const docsClasses = [
    "mx-auto block w-full min-w-0 max-w-3xl p-0",
    "[&>h2]:mt-12 [&>h2]:scroll-mt-20 [&>h2]:font-heading [&>h2]:text-2xl [&>h2]:leading-8 [&>h2]:font-semibold lg:[&>h2]:mt-16",
    "[&>h3]:mt-8 [&>h3]:scroll-mt-20 [&>h3]:text-lg [&>h3]:leading-7 [&>h3]:font-semibold",
    "[&>h4]:mt-8 [&>h4]:scroll-mt-20 [&>h4]:font-medium [&>h4]:tracking-tight",
    "[&>h5]:mt-8 [&>h5]:scroll-mt-20 [&>h5]:text-lg [&>h5]:leading-7 [&>h5]:font-medium [&>h5]:tracking-tight",
    "[&>h6]:mt-8 [&>h6]:scroll-mt-20 [&>h6]:font-medium [&>h6]:tracking-tight",
    "[&>h2+p]:mt-4 [&>p:not(:first-child)]:mt-6 [&>p]:text-muted-foreground [&>p]:leading-relaxed",
    "[&>ul]:my-6 [&>ul]:ms-6 [&>ul]:list-disc [&>ul]:text-muted-foreground",
    "[&>ol]:my-6 [&>ol]:ms-6 [&>ol]:list-decimal [&>ol]:text-muted-foreground",
    "[&>ul>li]:mt-2 [&>ol>li]:mt-2 [&>ul>li]:leading-relaxed [&>ol>li]:leading-relaxed",
    "[&>blockquote]:mt-6 [&>blockquote]:border-s-2 [&>blockquote]:ps-6 [&>blockquote]:italic",
    "[&>hr]:my-4 [&>hr]:border-0 [&>hr]:border-t md:[&>hr]:my-8",
  ];
  const standaloneClasses = [
    "mx-auto grid w-full max-w-[46rem] gap-5 py-16 pb-24",
    "[&>.eyebrow]:m-0 [&>.eyebrow]:text-[0.8125rem] [&>.eyebrow]:font-semibold [&>.eyebrow]:tracking-[0.08em] [&>.eyebrow]:text-site-accent-foreground [&>.eyebrow]:uppercase",
    "[&>h1]:text-[clamp(2.5rem,6vw,4.5rem)] [&>h1]:leading-[0.98]",
    "[&>p]:text-site-muted [&>p]:leading-relaxed [&>ul>li]:text-site-muted [&>ul>li]:leading-relaxed [&>ol>li]:text-site-muted [&>ol>li]:leading-relaxed",
    "[&>ul]:grid [&>ul]:gap-3 [&>ul]:ps-5",
  ];
  const sharedClasses = [
    "[&_a:focus-visible]:rounded-lg [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-3 [&_a:focus-visible]:outline-site-primary",
    "[&_:not(pre)>code]:relative [&_:not(pre)>code]:rounded-md [&_:not(pre)>code]:bg-muted [&_:not(pre)>code]:px-[0.3rem] [&_:not(pre)>code]:py-[0.2rem] [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-[0.8125rem] [&_:not(pre)>code]:text-muted-foreground",
    "[&>p_a]:font-medium [&>p_a]:text-foreground [&>p_a]:underline [&>p_a]:underline-offset-4 [&>ul_a]:font-medium [&>ul_a]:text-foreground [&>ul_a]:underline [&>ul_a]:underline-offset-4 [&>ol_a]:font-medium [&>ol_a]:text-foreground [&>ol_a]:underline [&>ol_a]:underline-offset-4",
    "[&>p_strong]:font-medium [&>p_strong]:text-foreground [&>ul_strong]:font-medium [&>ul_strong]:text-foreground [&>ol_strong]:font-medium [&>ol_strong]:text-foreground",
  ];
</script>

<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  type Props = HTMLAttributes<HTMLElement> & {
    children: Snippet;
    mode?: "docs" | "standalone";
  };

  let { children, class: className, mode = "standalone", ...rest }: Props = $props();
</script>

<article
  class={[mode === "docs" ? docsClasses : standaloneClasses, sharedClasses, className]}
  data-content-page={mode}
  {...rest}
>
  {@render children()}
</article>
