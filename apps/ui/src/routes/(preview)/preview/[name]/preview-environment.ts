import type { PreviewConfiguration } from "@/preview/contract.js";
import { createPreviewRuntime } from "./preview-runtime.js";

type QueuedTimer = {
  arguments: unknown[];
  callback: TimerHandler;
  interval: boolean;
};

export type PreviewBrowserControl = {
  readonly config: Readonly<PreviewConfiguration>;
  flushTimers(): number;
  pendingTimers(): number;
  setTimerMode(mode: PreviewConfiguration["timers"]): void;
};

declare global {
  interface Window {
    __COSS_PREVIEW_RUNTIME__: PreviewBrowserControl;
  }
}

function createMediaQueryList(query: string, matches: boolean): MediaQueryList {
  return {
    addEventListener() {},
    addListener() {},
    dispatchEvent: () => false,
    matches,
    media: query,
    onchange: null,
    removeEventListener() {},
    removeListener() {},
  };
}

function deterministicDate(NativeDate: DateConstructor, timestamp: number): DateConstructor {
  return new Proxy(NativeDate, {
    apply() {
      return new NativeDate(timestamp).toString();
    },
    construct(target, argumentsList) {
      return Reflect.construct(target, argumentsList.length === 0 ? [timestamp] : argumentsList);
    },
    get(target, property, receiver) {
      if (property === "now") return () => timestamp;
      return Reflect.get(target, property, receiver);
    },
  });
}

export function installPreviewEnvironment(config: PreviewConfiguration) {
  return (_node: HTMLElement) => {
    const root = document.documentElement;
    const runtime = createPreviewRuntime(config);
    const original = {
      colorScheme: root.style.colorScheme,
      date: window.Date,
      direction: root.dir,
      fetch: window.fetch,
      language: root.lang,
      matchMedia: window.matchMedia,
      random: Math.random,
      runtimeDescriptor: Object.getOwnPropertyDescriptor(window, "__COSS_PREVIEW_RUNTIME__"),
      theme: root.dataset.previewTheme,
      timers: {
        clearInterval: window.clearInterval,
        clearTimeout: window.clearTimeout,
        setInterval: window.setInterval,
        setTimeout: window.setTimeout,
      },
      wasDark: root.classList.contains("dark"),
      wasLight: root.classList.contains("light"),
    };

    root.dataset.previewTheme = config.theme;
    root.dir = config.direction;
    root.lang = config.locale;
    root.style.colorScheme = config.theme;
    root.classList.toggle("dark", config.theme === "dark");
    root.classList.toggle("light", config.theme === "light");

    Math.random = runtime.random;
    window.Date = deterministicDate(original.date, Date.parse(config.now));

    window.matchMedia = (query) => {
      if (query === "(prefers-reduced-motion: reduce)") {
        return createMediaQueryList(query, config.reducedMotion === "reduce");
      }
      if (query === "(prefers-reduced-motion: no-preference)") {
        return createMediaQueryList(query, config.reducedMotion === "no-preference");
      }
      return original.matchMedia.call(window, query);
    };

    if (config.network === "blocked") {
      window.fetch = async (input, init) => {
        const rawUrl = input instanceof Request ? input.url : String(input);
        const url = new URL(rawUrl, window.location.href);
        if (url.origin !== window.location.origin && url.protocol !== "data:") {
          throw new TypeError(`Preview network request blocked: ${url.origin}`);
        }
        return original.fetch.call(window, input, init);
      };
    }

    const queuedTimers = new Map<number, QueuedTimer>();
    let nextTimerId = 1;

    const queueTimer = (callback: TimerHandler, interval: boolean, argumentsList: unknown[]) => {
      const id = nextTimerId;
      nextTimerId += 1;
      queuedTimers.set(id, { arguments: argumentsList, callback, interval });
      return id;
    };
    const clearQueuedTimer = (id?: number) => {
      if (id !== undefined) queuedTimers.delete(id);
    };
    const useManualTimers = () => {
      window.setTimeout = ((callback: TimerHandler, _delay?: number, ...argumentsList: unknown[]) =>
        queueTimer(callback, false, argumentsList)) as typeof window.setTimeout;
      window.setInterval = ((
        callback: TimerHandler,
        _delay?: number,
        ...argumentsList: unknown[]
      ) => queueTimer(callback, true, argumentsList)) as typeof window.setInterval;
      window.clearTimeout = clearQueuedTimer as typeof window.clearTimeout;
      window.clearInterval = clearQueuedTimer as typeof window.clearInterval;
    };
    const useRealTimers = () => {
      window.setTimeout = original.timers.setTimeout;
      window.setInterval = original.timers.setInterval;
      window.clearTimeout = original.timers.clearTimeout;
      window.clearInterval = original.timers.clearInterval;
    };

    if (config.timers === "manual") {
      useManualTimers();
    }

    const control: PreviewBrowserControl = Object.freeze({
      config: runtime.config,
      flushTimers() {
        const snapshot = [...queuedTimers.entries()];
        for (const [id, timer] of snapshot) {
          if (!timer.interval) queuedTimers.delete(id);
          if (typeof timer.callback === "function") {
            timer.callback(...timer.arguments);
          }
        }
        return snapshot.length;
      },
      pendingTimers: () => queuedTimers.size,
      setTimerMode(mode) {
        if (mode === "manual") useManualTimers();
        else useRealTimers();
      },
    });
    Object.defineProperty(window, "__COSS_PREVIEW_RUNTIME__", {
      configurable: true,
      value: control,
    });

    return () => {
      queuedTimers.clear();
      Math.random = original.random;
      window.Date = original.date;
      window.fetch = original.fetch;
      window.matchMedia = original.matchMedia;
      window.setTimeout = original.timers.setTimeout;
      window.setInterval = original.timers.setInterval;
      window.clearTimeout = original.timers.clearTimeout;
      window.clearInterval = original.timers.clearInterval;
      if (original.runtimeDescriptor) {
        Object.defineProperty(window, "__COSS_PREVIEW_RUNTIME__", original.runtimeDescriptor);
      } else {
        Reflect.deleteProperty(window, "__COSS_PREVIEW_RUNTIME__");
      }
      if (original.theme) root.dataset.previewTheme = original.theme;
      else delete root.dataset.previewTheme;
      root.dir = original.direction;
      root.lang = original.language;
      root.style.colorScheme = original.colorScheme;
      root.classList.toggle("dark", original.wasDark);
      root.classList.toggle("light", original.wasLight);
    };
  };
}
