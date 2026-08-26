import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { pathToFileURL } from "node:url";

const referencePathPattern = /reference\/[A-Za-z0-9_./()-]+/g;

export function findUnapprovedReferencePaths(text) {
  const paths = text.match(referencePathPattern) ?? [];
  return [...new Set(paths.filter((path) => !path.startsWith("reference/apps/ui/")))];
}

function evidenceFiles(root) {
  if (!existsSync(root)) return [];

  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isFile() && extname(entry.name) === ".md")
    .map((entry) => join(root, entry.name));
}

export function checkEvidenceDirectory(root = "docs/porting/components") {
  const findings = [];

  for (const file of evidenceFiles(root)) {
    for (const path of findUnapprovedReferencePaths(readFileSync(file, "utf8"))) {
      findings.push({ file, path });
    }
  }

  return findings;
}

const isCli = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isCli) {
  const findings = checkEvidenceDirectory();

  if (findings.length > 0) {
    console.error(
      findings.map(({ file, path }) => `- ${file}: unapproved source path ${path}`).join("\n"),
    );
    process.exitCode = 1;
  } else {
    console.log("All component evidence stays inside the approved COSS source boundary.");
  }
}
