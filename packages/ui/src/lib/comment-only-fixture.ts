/** Checks generated empty SSR content without regex backtracking or HTML stripping. */
export function containsOnlyComments(value: string | undefined): boolean {
  if (value === undefined) return false;
  let offset = 0;
  while (offset < value.length) {
    if (!value.startsWith("<!--", offset)) return false;
    const end = value.indexOf("-->", offset + 4);
    if (end === -1) return false;
    offset = end + 3;
  }
  return true;
}
