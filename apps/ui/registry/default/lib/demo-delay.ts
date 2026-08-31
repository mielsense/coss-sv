import { onDestroy } from "svelte";

export type DemoDelay = (duration?: number) => Promise<boolean>;

/** Creates a demo-only delay that resolves false when its component is destroyed. */
export function createDemoDelay(): DemoDelay {
  const pending = new Map<ReturnType<typeof setTimeout>, (completed: boolean) => void>();
  let destroyed = false;

  onDestroy(() => {
    destroyed = true;
    for (const [timer, resolve] of pending) {
      clearTimeout(timer);
      resolve(false);
    }
    pending.clear();
  });

  return (duration = 800) => {
    if (destroyed) return Promise.resolve(false);

    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        pending.delete(timer);
        resolve(true);
      }, duration);
      pending.set(timer, resolve);
    });
  };
}
