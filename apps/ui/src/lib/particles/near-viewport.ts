import type { Attachment } from "svelte/attachments";

interface Registration {
  readonly onVisible: () => void;
}

const viewportMargin = 600;
const registrations = new WeakMap<Element, Registration>();
const targets = new Set<Element>();
let observer: IntersectionObserver | undefined;
let fallbackTimer: number | undefined;
let fallbackMonitoring = false;

function isNearViewport(node: Element): boolean {
  const bounds = node.getBoundingClientRect();
  return (
    bounds.bottom >= -viewportMargin &&
    bounds.top <= window.innerHeight + viewportMargin &&
    bounds.right >= 0 &&
    bounds.left <= window.innerWidth
  );
}

function stopFallbackMonitoring(): void {
  if (fallbackTimer !== undefined) {
    window.clearTimeout(fallbackTimer);
    fallbackTimer = undefined;
  }
  if (!fallbackMonitoring) return;
  window.removeEventListener("resize", scheduleFallbackCheck);
  window.removeEventListener("scroll", scheduleFallbackCheck, true);
  fallbackMonitoring = false;
}

function release(node: Element, registration: Registration): void {
  if (registrations.get(node) !== registration) return;

  registrations.delete(node);
  targets.delete(node);
  observer?.unobserve(node);

  if (targets.size === 0) {
    observer?.disconnect();
    observer = undefined;
    stopFallbackMonitoring();
  }
}

function checkFallbackTargets(): void {
  fallbackTimer = undefined;
  for (const node of [...targets]) {
    const registration = registrations.get(node);
    if (!registration || !isNearViewport(node)) continue;
    registration.onVisible();
    release(node, registration);
  }
}

function scheduleFallbackCheck(): void {
  if (fallbackTimer !== undefined) return;
  fallbackTimer = window.setTimeout(checkFallbackTargets, 0);
}

function startFallbackMonitoring(): void {
  if (!fallbackMonitoring) {
    window.addEventListener("resize", scheduleFallbackCheck, { passive: true });
    window.addEventListener("scroll", scheduleFallbackCheck, { capture: true, passive: true });
    fallbackMonitoring = true;
  }
  scheduleFallbackCheck();
}

function getObserver(): IntersectionObserver {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const registration = registrations.get(entry.target);
          if (!registration) continue;
          registration.onVisible();
          release(entry.target, registration);
        }
      },
      { rootMargin: "600px 0px" },
    );
  }
  return observer;
}

export function nearViewport(onVisible: () => void): Attachment<HTMLElement> {
  return (node) => {
    if (typeof IntersectionObserver === "undefined") {
      onVisible();
      return;
    }

    const registration = { onVisible } satisfies Registration;
    registrations.set(node, registration);
    targets.add(node);
    getObserver().observe(node);
    startFallbackMonitoring();

    return () => release(node, registration);
  };
}
