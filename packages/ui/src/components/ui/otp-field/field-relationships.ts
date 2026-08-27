export type FieldRelationships = {
  describedBy: string | undefined;
  labelledBy: string | undefined;
};

function belongsToField(element: Element, field: Element): boolean {
  return element.closest('[data-slot="field"]') === field;
}

export function getFieldRelationships(element: Element): FieldRelationships | null {
  const field = element.closest('[data-slot="field"]');
  if (!field) return null;

  const label = Array.from(field.querySelectorAll<HTMLElement>('[data-slot="field-label"]')).find(
    (candidate) => belongsToField(candidate, field),
  );
  const messages = Array.from(
    field.querySelectorAll<HTMLElement>(
      '[data-slot="field-description"], [data-slot="field-error"]',
    ),
  ).filter((candidate) => belongsToField(candidate, field));

  return {
    describedBy:
      messages
        .map((message) => message.id)
        .filter(Boolean)
        .join(" ") || undefined,
    labelledBy: label?.id,
  };
}

export function observeFieldRelationships(element: Element, sync: () => void): () => void {
  const field = element.closest('[data-slot="field"]');
  if (!field) return () => undefined;

  const observer = new MutationObserver(sync);
  observer.observe(field, {
    attributeFilter: ["data-slot", "id"],
    attributes: true,
    childList: true,
    subtree: true,
  });
  queueMicrotask(sync);
  const frame = requestAnimationFrame(sync);
  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
  };
}
