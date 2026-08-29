import type { Attachment } from "svelte/attachments";
import { on } from "svelte/events";
import type { TooltipHandle } from "./handle.svelte.js";

const DEFAULT_OPEN_DELAY = 600;

type TriggerBindings<Payload> = {
  closeDelay: number;
  closeOnClick: boolean;
  payload: Payload | undefined;
};

type TriggerMap<Payload> = {
  add(id: string, element: HTMLElement, bindings: () => TriggerBindings<Payload>): () => void;
  containsNode(target: EventTarget | null | undefined): boolean;
};

type TooltipState<Payload> = {
  activeTriggerId: string | null;
  applyTriggerBindings(bindings: TriggerBindings<Payload>): void;
  closeOnClick: boolean;
  disabled: boolean;
  open: boolean;
  popupElement: HTMLElement | null;
  setCursorPosition(x: number, y: number): void;
  setOpen(open: boolean, reason?: string, event?: Event, trigger?: HTMLElement | null): boolean;
  trackCursorAxis: "none" | "x" | "y" | "both";
  triggerElement: HTMLElement | null;
  triggerElements: TriggerMap<Payload>;
};

export type TooltipTriggerAttachmentOptions<Payload = unknown> = {
  /** ID used to register the target with the Shards tooltip handle. */
  id: string;
  /** ID of the tooltip popup that describes the target. Set this in markup too for SSR. */
  ariaDescribedBy?: string;
  closeDelay?: number;
  closeOnClick?: boolean;
  delay?: number;
  disabled?: boolean;
  payload?: Payload;
};

type ManagedAttribute =
  | "aria-describedby"
  | "data-popup-open"
  | "data-tooltip-trigger"
  | "data-trigger-disabled"
  | "id";

function restoreAttribute(
  node: HTMLElement,
  name: ManagedAttribute,
  previous: string | null,
): void {
  if (previous === null) node.removeAttribute(name);
  else node.setAttribute(name, previous);
}

/**
 * Applies Shards tooltip trigger behavior to an existing element without adding wrapper DOM.
 * The target stays owned by its Toolbar, Toggle, Select, or other behavioral primitive.
 *
 * This mirrors Shards Trigger registration, payload, focus, hover, cursor tracking, disabled,
 * click-dismissal, and state-attribute behavior through its public handle. Shards does not expose
 * its provider delay-group or safe-polygon internals as public attachments, so attached triggers
 * use their own delay timers and a popup-hover boundary instead of those two private mechanisms.
 */
export function createTriggerAttachment<Payload = unknown>(
  handle: TooltipHandle<Payload>,
  options: () => TooltipTriggerAttachmentOptions<Payload>,
): Attachment<HTMLElement> {
  return (node) => {
    const state = handle.state as unknown as TooltipState<Payload>;
    const previous = {
      "aria-describedby": node.getAttribute("aria-describedby"),
      "data-popup-open": node.getAttribute("data-popup-open"),
      "data-tooltip-trigger": node.getAttribute("data-tooltip-trigger"),
      "data-trigger-disabled": node.getAttribute("data-trigger-disabled"),
      id: node.getAttribute("id"),
    } satisfies Record<ManagedAttribute, string | null>;
    node.setAttribute("data-tooltip-trigger", "");

    let openTimer: ReturnType<typeof setTimeout> | undefined;
    let closeTimer: ReturnType<typeof setTimeout> | undefined;
    let pointerType = "mouse";
    let pointerFocus = false;

    const clearOpenTimer = (): void => {
      if (openTimer !== undefined) clearTimeout(openTimer);
      openTimer = undefined;
    };
    const clearCloseTimer = (): void => {
      if (closeTimer !== undefined) clearTimeout(closeTimer);
      closeTimer = undefined;
    };
    const current = (): Required<
      Pick<TooltipTriggerAttachmentOptions<Payload>, "closeDelay" | "closeOnClick" | "delay">
    > &
      TooltipTriggerAttachmentOptions<Payload> => ({
      closeDelay: 0,
      closeOnClick: true,
      delay: DEFAULT_OPEN_DELAY,
      ...options(),
    });
    const isDisabled = (): boolean => current().disabled === true || state.disabled;
    const isActive = (): boolean => state.activeTriggerId === current().id;

    const applyBindings = (): void => {
      const value = current();
      state.applyTriggerBindings({
        closeDelay: value.closeDelay,
        closeOnClick: value.closeOnClick,
        payload: value.payload,
      });
    };
    const open = (reason: "trigger-focus" | "trigger-hover", event: Event): void => {
      if (isDisabled()) return;
      clearCloseTimer();
      applyBindings();
      state.setOpen(true, reason, event, node);
    };
    const close = (
      reason: "trigger-focus" | "trigger-hover" | "trigger-press",
      event?: Event,
    ): void => {
      if (!isActive()) return;
      state.setOpen(false, reason, event, node);
    };

    const onFocus = (event: FocusEvent): void => {
      clearOpenTimer();
      if (pointerFocus) return;
      open("trigger-focus", event);
    };
    const onBlur = (event: FocusEvent): void => {
      clearOpenTimer();
      clearCloseTimer();
      closeTimer = setTimeout(() => {
        const active = node.ownerDocument.activeElement;
        if (node.contains(active) || state.popupElement?.contains(active)) return;
        if (node.matches(":hover")) return;
        close("trigger-focus", event);
      });
    };
    const onPointerDown = (event: PointerEvent): void => {
      pointerType = event.pointerType;
      pointerFocus = true;
      queueMicrotask(() => {
        pointerFocus = false;
      });
      clearOpenTimer();
    };
    const onPointerEnter = (event: PointerEvent): void => {
      pointerType = event.pointerType;
      if (pointerType === "touch" || isDisabled()) return;
      clearOpenTimer();
      clearCloseTimer();
      const delay = state.open ? 0 : current().delay;
      if (delay === 0) open("trigger-hover", event);
      else openTimer = setTimeout(() => open("trigger-hover", event), delay);
    };
    const onPointerMove = (event: PointerEvent): void => {
      if (pointerType === "touch" || state.open || state.trackCursorAxis === "none") return;
      state.setCursorPosition(event.clientX, event.clientY);
    };
    const onPointerLeave = (event: PointerEvent): void => {
      clearOpenTimer();
      if (!isActive() || pointerType === "touch") return;
      clearCloseTimer();
      closeTimer = setTimeout(() => {
        if (state.popupElement?.matches(":hover")) return;
        if (node.ownerDocument.activeElement === node) return;
        close("trigger-hover", event);
      }, current().closeDelay);
    };
    const onClick = (event: MouseEvent): void => {
      clearOpenTimer();
      const value = current();
      if (value.closeOnClick && state.open && isActive()) {
        close("trigger-press", event);
      }
    };

    const disposeEffects = $effect.root(() => {
      $effect(() => {
        const value = current();
        node.id = value.id;
        if (value.ariaDescribedBy) node.setAttribute("aria-describedby", value.ariaDescribedBy);
        else node.removeAttribute("aria-describedby");
        node.toggleAttribute("data-trigger-disabled", isDisabled());
        node.toggleAttribute("data-popup-open", state.open && state.activeTriggerId === value.id);
      });

      $effect(() => {
        const value = current();
        return state.triggerElements.add(value.id, node, () => ({
          closeDelay: value.closeDelay,
          closeOnClick: value.closeOnClick,
          payload: value.payload,
        }));
      });
    });

    const cleanups = [
      on(node, "focus", onFocus),
      on(node, "blur", onBlur),
      on(node, "pointerdown", onPointerDown),
      on(node, "pointerenter", onPointerEnter),
      on(node, "pointermove", onPointerMove),
      on(node, "pointerleave", onPointerLeave),
      on(node, "click", onClick),
    ];

    return () => {
      clearOpenTimer();
      clearCloseTimer();
      cleanups.forEach((cleanup) => {
        cleanup();
      });
      disposeEffects();
      restoreAttribute(node, "id", previous.id);
      restoreAttribute(node, "aria-describedby", previous["aria-describedby"]);
      restoreAttribute(node, "data-popup-open", previous["data-popup-open"]);
      restoreAttribute(node, "data-tooltip-trigger", previous["data-tooltip-trigger"]);
      restoreAttribute(node, "data-trigger-disabled", previous["data-trigger-disabled"]);
    };
  };
}
