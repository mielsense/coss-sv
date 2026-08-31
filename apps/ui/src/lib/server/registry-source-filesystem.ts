import { readFile, realpath } from "node:fs/promises";
import { relative, resolve } from "node:path";
import type { RegistryDocument, RegistryDocumentLoader } from "./registry-component-source.js";

export function createFilesystemRegistryDocumentLoader(root: string): RegistryDocumentLoader {
  let canonicalRoot: Promise<string> | undefined;

  return async (name) => {
    canonicalRoot ??= realpath(root);
    const registryRoot = await canonicalRoot;
    const documentPath = await realpath(resolve(registryRoot, `${name}.json`));
    const fromRoot = relative(registryRoot, documentPath);
    if (fromRoot.startsWith("..") || fromRoot === "") {
      throw new Error("Registry source escapes the registry root");
    }
    return JSON.parse(await readFile(documentPath, "utf8")) as RegistryDocument;
  };
}
