export const referencePort = 4000;
export const targetPreviewPortEnvironmentVariable = "COSS_TARGET_PREVIEW_PORT";

export function resolveTargetPreviewPort(value: string | undefined) {
  const candidate = value?.trim() || "4173";
  if (!/^\d+$/.test(candidate)) {
    throw new Error(`${targetPreviewPortEnvironmentVariable} must be an integer TCP port.`);
  }

  const port = Number(candidate);
  if (!Number.isSafeInteger(port) || port < 1 || port > 65_535) {
    throw new Error(`${targetPreviewPortEnvironmentVariable} must be between 1 and 65535.`);
  }
  if (port === referencePort) {
    throw new Error(
      `${targetPreviewPortEnvironmentVariable} cannot use ${referencePort}, which belongs to the React reference server.`,
    );
  }
  return port;
}

export function targetPreviewBaseUrl(port: number) {
  return `http://127.0.0.1:${port}`;
}

export function createLocalPreviewOrigins(targetPort: number) {
  return new Set(
    ["http", "ws"].flatMap((protocol) =>
      ["127.0.0.1", "localhost"].flatMap((host) => [
        `${protocol}://${host}:${referencePort}`,
        `${protocol}://${host}:${targetPort}`,
      ]),
    ),
  );
}

export const targetPreviewPort = resolveTargetPreviewPort(
  // biome-ignore lint/suspicious/noUndeclaredEnvVars: Playwright and its workers share this explicit local port override.
  process.env.COSS_TARGET_PREVIEW_PORT,
);
