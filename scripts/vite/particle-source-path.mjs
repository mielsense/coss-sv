/**
 * @param {string} filename
 * @returns {{ id: string; path: string }}
 */
export function registryDocumentPath(filename) {
  const normalizedFilename = filename.replaceAll("\\", "/");
  const marker = "/registry/default/particles/";
  const markerIndex = normalizedFilename.lastIndexOf(marker);
  const particleFilename = normalizedFilename.slice(markerIndex + marker.length);
  const id = particleFilename.endsWith(".svelte")
    ? particleFilename.slice(0, -".svelte".length)
    : "";
  if (
    markerIndex === -1 ||
    particleFilename.includes("/") ||
    !/^p-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)
  ) {
    throw new Error(`Highlighted particle source is outside the particle registry: ${filename}`);
  }
  return {
    id,
    path: `${normalizedFilename.slice(0, markerIndex)}/static/r/${id}.json`,
  };
}
