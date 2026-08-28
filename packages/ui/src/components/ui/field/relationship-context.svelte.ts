import { createContext } from "svelte";

export class FieldRelationshipState {
  #defaultControlId: string;
  #readControlId: () => string | undefined;
  #readLabelId: () => string | undefined;
  #readDescribedBy: () => string | undefined;
  #writeLabelId: (id: string | undefined) => void;
  #writeDescribedBy: (ids: string | undefined) => void;
  #writeControlId: (id: string | undefined) => void;
  #initialControlIds: string[] = [];
  #controlRegistrations: { id: string; token: symbol }[] = [];
  #initialLabelId: string | undefined;
  #initialMessageIds = new Set<string>();
  constructor(
    defaultControlId: string,
    readControlId: () => string | undefined,
    writeControlId: (id: string | undefined) => void,
    readLabelId: () => string | undefined,
    writeLabelId: (id: string | undefined) => void,
    readDescribedBy: () => string | undefined,
    writeDescribedBy: (ids: string | undefined) => void,
  ) {
    this.#defaultControlId = defaultControlId;
    this.#readControlId = readControlId;
    this.#writeControlId = writeControlId;
    this.#readLabelId = readLabelId;
    this.#writeLabelId = writeLabelId;
    this.#readDescribedBy = readDescribedBy;
    this.#writeDescribedBy = writeDescribedBy;
  }

  get controlId(): string | undefined {
    return this.#readControlId();
  }

  get defaultControlId(): string {
    return this.#defaultControlId;
  }

  resolveDefaultControlId(fallbackId: string): string {
    const defaultIsRegistered =
      this.#initialControlIds.includes(this.#defaultControlId) ||
      this.#controlRegistrations.some(({ id }) => id === this.#defaultControlId);
    return defaultIsRegistered ? fallbackId : this.#defaultControlId;
  }

  get describedBy(): string | undefined {
    return this.#readDescribedBy();
  }

  get labelledBy(): string | undefined {
    return this.#readLabelId();
  }

  registerInitialControlId(id: string): void {
    if (!this.#initialControlIds.includes(id)) this.#initialControlIds.push(id);
    this.#syncControlId();
  }

  registerControlId(id: string): () => void {
    const initialIndex = this.#initialControlIds.indexOf(id);
    if (initialIndex !== -1) this.#initialControlIds.splice(initialIndex, 1);
    const token = Symbol();
    this.#controlRegistrations.push({ id, token });
    this.#syncControlId();
    return () => {
      const index = this.#controlRegistrations.findIndex(
        (registration) => registration.token === token,
      );
      if (index === -1) return;
      this.#controlRegistrations.splice(index, 1);
      this.#syncControlId();
    };
  }

  #syncControlId(): void {
    this.#writeControlId(
      this.#controlRegistrations[0]?.id ?? this.#initialControlIds[0] ?? this.#defaultControlId,
    );
  }

  registerInitialLabelId(id: string): void {
    this.#initialLabelId = id;
    this.#writeLabelId(id);
  }

  registerLabelId(id: string): () => void {
    if (this.#initialLabelId === id) this.#initialLabelId = undefined;
    this.#writeLabelId(id);
    return () => {
      if (this.#readLabelId() === id) this.#writeLabelId(undefined);
    };
  }

  registerInitialMessageId(id: string): void {
    this.#initialMessageIds.add(id);
    if (!this.#readMessageIds().includes(id)) {
      this.#writeMessageIds([...this.#readMessageIds(), id]);
    }
  }

  registerMessageId(id: string): () => void {
    this.#initialMessageIds.delete(id);
    if (!this.#readMessageIds().includes(id)) {
      this.#writeMessageIds([...this.#readMessageIds(), id]);
    }
    return () => {
      this.#writeMessageIds(this.#readMessageIds().filter((messageId) => messageId !== id));
    };
  }

  #readMessageIds(): string[] {
    return this.#readDescribedBy()?.split(/\s+/).filter(Boolean) ?? [];
  }

  #writeMessageIds(ids: string[]): void {
    this.#writeDescribedBy(ids.join(" ") || undefined);
  }
}

const [getRequiredFieldRelationshipContext, setFieldRelationshipContext] =
  createContext<FieldRelationshipState>();

export { setFieldRelationshipContext };

export function getFieldRelationshipContext(): FieldRelationshipState | undefined {
  try {
    return getRequiredFieldRelationshipContext();
  } catch (error) {
    if (error instanceof Error && error.name === "Svelte error") return undefined;
    throw error;
  }
}
