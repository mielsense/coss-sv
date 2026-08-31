import { type BundledLanguage, getSingletonHighlighter, type Highlighter } from "shiki";

const languages = [
  "bash",
  "css",
  "diff",
  "markdown",
  "svelte",
  "typescript",
] satisfies BundledLanguage[];
const languageAliases: Readonly<Record<string, BundledLanguage>> = {
  md: "markdown",
  sh: "bash",
  ts: "typescript",
};
const supportedLanguages = new Set<string>(languages);

export type DocumentationLanguage = BundledLanguage | "text";

export const documentationHighlighter: Promise<Highlighter> = getSingletonHighlighter({
  langs: languages,
  themes: ["github-dark", "github-light"],
});

export function resolveDocumentationLanguage(language?: string | null): DocumentationLanguage {
  if (!language) return "text";
  const normalized = language.toLowerCase();
  return (
    languageAliases[normalized] ??
    (supportedLanguages.has(normalized) ? (normalized as BundledLanguage) : "text")
  );
}
