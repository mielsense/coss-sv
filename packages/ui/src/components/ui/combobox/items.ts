export type ComboboxPrimitiveValue = string | number | bigint | boolean;
export type ComboboxItemsData<Item> = readonly Item[] | readonly { items: readonly Item[] }[];

export interface CreateComboboxItemsOptions<Item, Value extends ComboboxPrimitiveValue> {
  getValue: (item: Item) => Value;
  getLabel: (item: Item) => string;
}

const collectionMarker = Symbol("ComboboxItemCollection");

export interface ComboboxItemCollection<Item, Value = ComboboxPrimitiveValue> {
  readonly [collectionMarker]: true;
  readonly data: ComboboxItemsData<Item> | undefined;
  readonly getValue: (item: Item) => Value;
  readonly getLabel: (item: Item) => string;
}

/** Derives labels and primitive selection values when the collection is consumed. */
export function createComboboxItems<Item, Value extends ComboboxPrimitiveValue>(
  data: ComboboxItemsData<Item> | undefined,
  options: CreateComboboxItemsOptions<Item, Value>,
): ComboboxItemCollection<Item, Value> {
  return { [collectionMarker]: true, data, ...options };
}

export function isComboboxItemCollection<Item, Value>(
  items: unknown,
): items is ComboboxItemCollection<Item, Value> {
  return typeof items === "object" && items !== null && collectionMarker in items;
}

function isGroup(item: unknown): item is { items: readonly unknown[] } {
  return typeof item === "object" && item !== null && "items" in item && Array.isArray(item.items);
}

/** Adapts the collection to Shards' shared item/selection type without changing source data. */
export function resolveComboboxItems<Item, Value>(
  collection: ComboboxItemCollection<Item, Value>,
  filteredItems?: ComboboxItemsData<Item>,
) {
  const records = new Map<Value, { item: Item; label: string }>();

  function normalize(
    data: ComboboxItemsData<Item> | undefined,
  ): ComboboxItemsData<Value> | undefined {
    if (data === undefined) return undefined;
    const seen = new Set<Value>();
    function selectionValue(item: Item): Value {
      if (item == null) throw new Error("Combobox items must not contain null or undefined.");
      const value = collection.getValue(item);
      if (!["string", "number", "bigint", "boolean"].includes(typeof value)) {
        throw new Error("Combobox item values must be non-null primitives.");
      }
      if (seen.has(value)) throw new Error("Combobox item values must be unique.");
      seen.add(value);
      records.set(value, { item, label: collection.getLabel(item) });
      return value;
    }
    return data.map((item) =>
      isGroup(item)
        ? { ...item, items: (item.items as readonly Item[]).map(selectionValue) }
        : selectionValue(item as Item),
    ) as ComboboxItemsData<Value>;
  }

  const items = normalize(collection.data);
  const filtered = normalize(filteredItems);

  function toItem(value: unknown): unknown {
    if (isGroup(value)) return { ...value, items: value.items.map(toItem) };
    return records.get(value as Value)?.item ?? value;
  }

  return {
    items,
    filteredItems: filtered,
    getLabel: (value: Value) => records.get(value)?.label,
    toItem,
    groupValues: (items: readonly unknown[]) =>
      items.map((item) => collection.getValue(item as Item)),
    filterItem: (value: Value) => records.get(value)?.item,
  };
}
