import { onDestroy } from "svelte";

export type CopyToClipboardOptions = {
  timeout?: number;
  onCopy?: () => void;
};

export type CopyToClipboard = {
  copyToClipboard: (value: string) => void;
  readonly isCopied: boolean;
};

export function useCopyToClipboard({
  timeout = 2_000,
  onCopy,
}: CopyToClipboardOptions = {}): CopyToClipboard {
  let isCopied = $state(false);
  let resetTimer: ReturnType<typeof setTimeout> | undefined;
  let destroyed = false;

  function copyToClipboard(value: string): void {
    if (destroyed || !value || typeof window === "undefined" || !navigator.clipboard?.writeText) {
      return;
    }

    void navigator.clipboard.writeText(value).then(() => {
      if (destroyed) return;
      clearTimeout(resetTimer);
      isCopied = true;
      onCopy?.();

      if (timeout !== 0) {
        resetTimer = setTimeout(() => {
          isCopied = false;
          resetTimer = undefined;
        }, timeout);
      }
    }, console.error);
  }

  onDestroy(() => {
    destroyed = true;
    clearTimeout(resetTimer);
  });

  return {
    copyToClipboard,
    get isCopied() {
      return isCopied;
    },
  };
}
