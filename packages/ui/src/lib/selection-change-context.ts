import { getContext, setContext } from "svelte";
import {
  createChangeEventDetails,
  type SelectionChangeEventDetails,
  type SelectionChangeEventReason,
} from "./change-event-details.js";

type PreparedChange = {
  event: Event;
  reason: SelectionChangeEventReason;
  trigger: Element | undefined;
};

export type SelectionChangeContext = {
  clear(event: Event): void;
  details(fallback?: SelectionChangeEventReason): SelectionChangeEventDetails;
  prepare(reason: SelectionChangeEventReason, event: Event): void;
};

const selectionChangeContextKey = Symbol("coss-selection-change");

export function createSelectionChangeContext(): SelectionChangeContext {
  let prepared: PreparedChange | undefined;

  return {
    clear(event) {
      if (prepared?.event === event) prepared = undefined;
    },
    details(fallback = "none") {
      return createChangeEventDetails(
        prepared?.reason ?? fallback,
        prepared?.event,
        prepared?.trigger,
      );
    },
    prepare(reason, event) {
      prepared = {
        event,
        reason,
        trigger: event.currentTarget instanceof Element ? event.currentTarget : undefined,
      };
      queueMicrotask(() => {
        if (prepared?.event === event) prepared = undefined;
      });
    },
  };
}

export function getSelectionChangeContext(): SelectionChangeContext | undefined {
  return getContext<SelectionChangeContext | undefined>(selectionChangeContextKey);
}

export function setSelectionChangeContext(context: SelectionChangeContext): SelectionChangeContext {
  return setContext(selectionChangeContextKey, context);
}

function flattenSelectionItems<Value>(items: unknown): Value[] {
  const values: Value[] = [];
  const append = (entry: unknown): void => {
    if (entry && typeof entry === "object" && "label" in entry && "value" in entry) {
      values.push((entry as { value: Value }).value);
    } else {
      values.push(entry as Value);
    }
  };

  const entries = Array.isArray(items)
    ? items
    : items && typeof items === "object"
      ? Object.values(items)
      : [];
  for (const entry of entries) {
    if (entry && typeof entry === "object" && Array.isArray((entry as { items?: unknown }).items)) {
      for (const groupedItem of (entry as { items: unknown[] }).items) append(groupedItem);
    } else {
      append(entry);
    }
  }
  return values;
}

function hasSamePrimitiveFields(left: unknown, right: unknown): boolean {
  if (!left || !right || typeof left !== "object" || typeof right !== "object") return false;
  const keys = Object.keys(left).filter((key) => {
    const value = (left as Record<string, unknown>)[key];
    return value === null || typeof value !== "object";
  });
  return (
    keys.length > 0 &&
    keys.every(
      (key) => (left as Record<string, unknown>)[key] === (right as Record<string, unknown>)[key],
    )
  );
}

/** Restores a selected object's identity after it crosses a reactive primitive boundary. */
export function canonicalizeSelectionValue<Value>(
  value: Value,
  items: unknown,
  isItemEqualToValue?: (item: Value, value: Value) => boolean,
  itemToString?: (item: Value) => string,
): Value {
  for (const item of flattenSelectionItems<Value>(items)) {
    if (Object.is(item, value)) return item;
    if (isItemEqualToValue?.(item, value)) return item;
    if (itemToString && itemToString(item) === itemToString(value)) return item;
    if (hasSamePrimitiveFields(item, value)) return item;
  }
  return value;
}

export function areSelectionValuesEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) return true;
  return (
    Array.isArray(left) &&
    Array.isArray(right) &&
    left.length === right.length &&
    left.every((value, index) => Object.is(value, right[index]))
  );
}
