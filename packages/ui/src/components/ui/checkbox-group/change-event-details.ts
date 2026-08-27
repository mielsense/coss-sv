export type CheckboxGroupChangeEventDetails = {
  readonly reason: "none";
  readonly event: Event;
  cancel: () => void;
  allowPropagation: () => void;
  readonly isCanceled: boolean;
  readonly isPropagationAllowed: boolean;
  readonly trigger: Element | undefined;
};

export function createCheckboxGroupChangeEventDetails(
  event: Event = new Event("base-ui"),
): CheckboxGroupChangeEventDetails {
  let canceled = false;
  let propagationAllowed = false;

  return {
    reason: "none",
    event,
    cancel() {
      canceled = true;
    },
    allowPropagation() {
      propagationAllowed = true;
    },
    get isCanceled() {
      return canceled;
    },
    get isPropagationAllowed() {
      return propagationAllowed;
    },
    trigger: undefined,
  };
}
